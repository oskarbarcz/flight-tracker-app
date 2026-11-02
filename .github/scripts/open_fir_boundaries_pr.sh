#!/usr/bin/env bash
set -euo pipefail

: "${VATSPY_COMMIT:?}"
: "${RUNNER_TEMP:?}"

short_commit="${VATSPY_COMMIT::7}"
log_file="$RUNNER_TEMP/generate.log"
body_file="$RUNNER_TEMP/body.md"

if git diff --quiet -- public/airspace; then
  echo "FIR boundaries already match VATSpy $short_commit"
  exit 0
fi

branch="fir-boundaries/$short_commit"
if git ls-remote --exit-code --heads origin "$branch" > /dev/null; then
  echo "Branch $branch already exists"
  exit 0
fi

npm version patch --no-git-tag-version
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git switch -c "$branch"
git add public/airspace package.json package-lock.json
git commit -m "Update FIR boundaries to VATSpy $short_commit"
git push origin "$branch"

{
  echo "Regenerated \`public/airspace\` from [vatsimnetwork/vatspy-data-project@$short_commit](https://github.com/vatsimnetwork/vatspy-data-project/commit/$VATSPY_COMMIT)."
  echo
  echo '```'
  cat "$log_file"
  echo '```'
} > "$body_file"

gh pr create --title "Update FIR boundaries to VATSpy $short_commit" --body-file "$body_file"
