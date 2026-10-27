#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: start-chrome.sh <cdp-port> <profile-dir> [start-url] [--insecure]" >&2
  exit 64
fi

port="$1"
profile="$2"
url="${3:-http://localhost:5173/sign-in}"
insecure="${4:-}"

chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
flags=(
  "--remote-debugging-port=${port}"
  "--user-data-dir=${profile}"
  "--no-first-run"
  "--no-default-browser-check"
  "--window-size=1440,960"
)
if [[ "$insecure" == "--insecure" ]]; then
  flags+=("--disable-web-security")
fi

if curl -s "http://127.0.0.1:${port}/json/version" >/dev/null; then
  echo "chrome already listening on ${port}"
  exit 0
fi

mkdir -p "$profile"
"$chrome" "${flags[@]}" "$url" >"${profile}.log" 2>&1 &

for _ in $(seq 1 40); do
  if curl -s "http://127.0.0.1:${port}/json/version" >/dev/null; then
    echo "chrome ready on ${port} (profile ${profile})"
    exit 0
  fi
  sleep 0.25
done

echo "chrome did not open its debugging port ${port}; see ${profile}.log" >&2
exit 1
