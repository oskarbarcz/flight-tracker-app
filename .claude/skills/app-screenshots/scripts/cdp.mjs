import { readFile, writeFile } from "node:fs/promises";

const PORT = Number(process.env.CDP_PORT ?? 9333);
const ORIGIN = process.env.CDP_ORIGIN ?? "http://localhost:5173";
const SCALE = Number(process.env.CDP_SCALE ?? 2);
const HARD_TIMEOUT_MS = Number(process.env.CDP_TIMEOUT_MS ?? 180000);

setTimeout(() => {
  console.error(`cdp: gave up after ${HARD_TIMEOUT_MS}ms (a page reload or a promise that never settled)`);
  process.exit(2);
}, HARD_TIMEOUT_MS).unref();

const steps = process.argv
  .slice(2)
  .join("\u0000")
  .split("\u0000--\u0000")
  .map((segment) => segment.split("\u0000").filter((part) => part !== ""))
  .filter((segment) => segment.length > 0);

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page =
  targets.find((t) => t.type === "page" && t.url.startsWith(ORIGIN)) ?? targets.find((t) => t.type === "page");
if (!page) throw new Error(`no page target on port ${PORT}`);

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let nextId = 1;
const pending = new Map();
const listeners = [];
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
  } else if (message.method) {
    for (const listener of listeners) listener(message);
  }
};

function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}

async function capture() {
  const size = await evaluate("({ width: innerWidth, height: innerHeight })");
  const { data } = await send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width: size.width, height: size.height, scale: SCALE },
  });
  return Buffer.from(data, "base64");
}

async function elementCenter(selector) {
  return evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error("no element for " + ${JSON.stringify(selector)});
    const rect = element.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  })()`);
}

async function clickSwitch(label) {
  await evaluate(`(() => {
    const controls = [...document.querySelectorAll('[aria-label="Tracking view"] a, [aria-label="Tracking view"] button')];
    const control = controls.find((element) => element.textContent.trim() === ${JSON.stringify(label)});
    if (!control) throw new Error("no view switch labelled " + ${JSON.stringify(label)});
    control.click();
  })()`);
}

await send("Page.enable");
await send("Emulation.setFocusEmulationEnabled", { enabled: true });
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: process.env.CDP_MOTION ?? "no-preference" }],
});
if (process.env.CDP_TOUCH) {
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
}
if (process.env.CDP_CLOCK) {
  const target = Date.parse(process.env.CDP_CLOCK);
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      const RealDate = Date;
      const offset = ${target} - RealDate.now();
      class ShiftedDate extends RealDate {
        constructor(...values) {
          if (values.length === 0) super(RealDate.now() + offset);
          else super(...values);
        }
        static now() {
          return RealDate.now() + offset;
        }
      }
      globalThis.Date = ShiftedDate;
    })();`,
  });
}

if (process.env.CDP_API_DELAY) {
  const rules = process.env.CDP_API_DELAY.split(",").map((rule) => rule.split("="));
  const fallback = Number(rules.find((rule) => rule.length === 1)?.[0] ?? 0);
  const delayFor = (url) => Number(rules.find((rule) => rule.length === 2 && url.includes(rule[0]))?.[1] ?? fallback);
  listeners.push((message) => {
    if (message.method !== "Fetch.requestPaused") return;
    const { requestId, request } = message.params;
    setTimeout(() => send("Fetch.continueRequest", { requestId }).catch(() => {}), delayFor(request.url));
  });
  await send("Fetch.enable", {
    patterns: [{ urlPattern: "http://localhost/api/*" }, { urlPattern: "http://localhost:1080/*" }],
  });
}

const commands = {
  async front() {
    await send("Page.bringToFront");
    return `front, ${await evaluate("document.visibilityState")}`;
  },
  async viewport(width, height, kind) {
    if (width === "reset") {
      await send("Emulation.clearDeviceMetricsOverride");
      return "viewport reset";
    }
    await send("Emulation.setDeviceMetricsOverride", {
      width: Number(width),
      height: Number(height),
      deviceScaleFactor: kind === "mobile" ? 2 : 1,
      mobile: kind === "mobile",
    });
    await wait(500);
    return `viewport ${width}x${height}${kind === "mobile" ? " mobile" : ""}`;
  },
  async nav(url, settleMs = "6000") {
    await send("Page.navigate", { url: url.startsWith("/") ? `${ORIGIN}${url}` : url });
    await wait(Number(settleMs));
    return evaluate("location.href");
  },
  async go(path, settleMs = "2000") {
    await evaluate(`(() => {
      const link = document.createElement("a");
      link.href = ${JSON.stringify(path)};
      document.body.appendChild(link);
      link.click();
      link.remove();
    })()`);
    await wait(Number(settleMs));
    return evaluate("location.pathname");
  },
  async signin(email, password) {
    await send("Page.navigate", { url: `${ORIGIN}/sign-in` });
    for (let attempt = 0; attempt < 120; attempt++) {
      await wait(250);
      if (await evaluate("!!document.getElementById('email')").catch(() => false)) break;
    }
    await evaluate(`(() => {
      const setValue = (element, value) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(element, value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
      };
      setValue(document.getElementById("email"), ${JSON.stringify(email)});
      setValue(document.getElementById("password"), ${JSON.stringify(password)});
    })()`);
    await wait(300);
    await evaluate("document.querySelector('button[type=submit]').click()");
    for (let attempt = 0; attempt < 60; attempt++) {
      await wait(250);
      if (await evaluate("!!localStorage.getItem('at')").catch(() => false)) break;
    }
    return evaluate("location.href + ' signedIn=' + !!localStorage.getItem('at')");
  },
  async theme(mode) {
    await evaluate(`localStorage.setItem("flowbite-theme-mode", ${JSON.stringify(mode)})`);
    return `theme ${mode} (applies on the next nav)`;
  },
  async shot(file) {
    await writeFile(file, await capture());
    return file;
  },
  async hover(selector, action, file) {
    const output = file ?? action;
    const point = await elementCenter(selector);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: point.x, y: point.y });
    if (action === "click") {
      await send("Input.dispatchMouseEvent", { type: "mousePressed", ...point, button: "left", clickCount: 1 });
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...point, button: "left", clickCount: 1 });
    }
    await wait(300);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: point.x + 1, y: point.y + 1 });
    await wait(700);
    await writeFile(output, await capture());
    return output;
  },
  async frames(label, count, intervalMs, prefix, playbackRate = "1") {
    await send("Animation.enable");
    await send("Animation.setPlaybackRate", { playbackRate: Number(playbackRate) });
    await clickSwitch(label);
    for (let index = 0; index < Number(count); index++) {
      await writeFile(`${prefix}-${index}.png`, await capture());
      await wait(Number(intervalMs));
    }
    await send("Animation.setPlaybackRate", { playbackRate: 1 });
    return evaluate("location.pathname");
  },
  async eval(expression) {
    return JSON.stringify(await evaluate(expression), null, 2);
  },
  async evalfile(file) {
    return JSON.stringify(await evaluate(await readFile(file, "utf8")), null, 2);
  },
  async sleep(ms) {
    await wait(Number(ms));
    return `slept ${ms}ms`;
  },
};

try {
  for (const [command, ...args] of steps) {
    const handler = commands[command];
    if (!handler) throw new Error(`unknown command ${command}`);
    console.log(await handler(...args));
  }
} finally {
  ws.close();
}
