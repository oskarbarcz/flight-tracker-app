const FLIGHT = "app.mypreflight.io/track/2d1c92f6…";

window.SLIDES = {
  "01-full-page-map": {
    theme: "dark",
    headline: "The map fills the page. <em>Your flight stays on top.</em>",
    lede: "Tracking now puts the map behind everything. The flight and phase cards stay where they were, and the whole route fits in the space below them.",
    before: "The map sat in a box under the cards, and its bottom edge ran off the screen.",
    after: "Edge to edge, with live figures and share links in a bar along the bottom.",
    stage: () => `
      <div class="columns">
        <div class="column"><span class="pill before">Before</span>${crop("before-monitor-dark.png", CONTENT, 560)}</div>
        <div class="column"><span class="pill after">After</span>${crop("after-tracking-dark.png", CONTENT, 560)}</div>
      </div>`,
  },
  "02-a-link-for-each-view": {
    theme: "light",
    headline: "Briefing and Tracking, <em>each with its own link.</em>",
    lede: "The view you are on is now part of the address, so a refresh, a bookmark or a shared link opens exactly where you left off.",
    before: "One address for both views. Reload, and the page picked a view for you.",
    after: "Every briefing tab has a link too. A bare link opens Briefing before off-block and Tracking after it.",
    stage: () => `
      <div class="rows">
        <div class="row"><span class="pill before">Before</span>
          <div class="columns">
            ${browser(FLIGHT, "before-briefing-light-0.png", TOP_OF_PAGE, 568)}
            ${browser(FLIGHT, "before-monitor-light.png", TOP_OF_PAGE, 568)}
          </div>
        </div>
        <div class="row"><span class="pill after">After</span>
          <div class="columns">
            ${browser(`${FLIGHT}<strong>/briefing</strong>`, "after-briefing-light.png", TOP_OF_PAGE, 568)}
            ${browser(`${FLIGHT}<strong>/tracking</strong>`, "after-tracking-light.png", TOP_OF_PAGE, 568)}
          </div>
        </div>
      </div>`,
  },
  "03-smooth-switch": {
    theme: "dark",
    headline: "Switch views <em>without the jump.</em>",
    lede: "Going between Briefing and Tracking is one smooth step. The cards hold still, the switch slides across, and the map fades in already in place.",
    before: "The page swapped at once, and the map rebuilt itself every time: a blank frame first, then the tiles.",
    after: "The map stays loaded in the background, so it fades straight back in, already centred.",
    stage: () => `
      <div class="columns">
        <div class="column"><span class="pill before">Before</span>${crop("before-to-monitor-dark-0.png", CONTENT, 560)}<p class="caption">The first frame after pressing Monitor.</p></div>
        <div class="column"><span class="pill after">After</span>${crop("after-to-tracking-dark-1.png", CONTENT, 560)}<p class="caption">Halfway through switching to Tracking.</p></div>
      </div>`,
  },
  "04-share-buttons": {
    theme: "light",
    headline: "Share buttons <em>that say what they do.</em>",
    lede: "Point at a share button on the map and its label appears straight away. Copy the link, and the label confirms it.",
    before: "Two bare icons. The browser's own hint turned up a second later, if at all.",
    after: "Clear labels, a confirmation on copy, and buttons of equal size on phones.",
    stage: () => `
      <div class="columns">
        <div class="column"><span class="pill before">Before</span>${crop("before-hover-open-light.png", { x: 930, y: 330, w: 510, h: 130 }, 560)}<p class="caption">Pointing at “open in a new tab”.</p></div>
        <div class="column"><span class="pill after">After</span>
          ${crop("after-hover-open-light.png", { x: 930, y: 770, w: 510, h: 130 }, 560)}
          ${crop("after-hover-copied-light.png", { x: 930, y: 770, w: 510, h: 130 }, 560)}
          <p class="caption">Pointing at each button, then after copying.</p>
        </div>
      </div>`,
  },
};
