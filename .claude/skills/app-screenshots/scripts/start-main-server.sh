#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: start-main-server.sh <worktree-dir> [git-ref] [port]" >&2
  exit 64
fi

worktree="$1"
ref="${2:-origin/main}"
port="${3:-5174}"
repo="$(git rev-parse --show-toplevel)"

git -C "$repo" fetch -q origin
if [[ ! -d "$worktree" ]]; then
  git -C "$repo" worktree add --detach "$worktree" "$ref" >/dev/null
fi

cp "$repo/.env.local" "$worktree/.env.local"
if [[ ! -d "$worktree/node_modules" ]]; then
  cp -cR "$repo/node_modules" "$worktree/node_modules"
fi

cd "$worktree"
nohup npx react-router dev --port "$port" --strictPort >"${worktree}.log" 2>&1 &

for _ in $(seq 1 80); do
  if curl -s -o /dev/null "http://localhost:${port}/"; then
    echo "$(git log --oneline -1) serving on http://localhost:${port} (log ${worktree}.log)"
    exit 0
  fi
  sleep 0.5
done

echo "dev server did not start on ${port}; see ${worktree}.log" >&2
exit 1
