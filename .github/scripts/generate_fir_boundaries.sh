#!/usr/bin/env bash
set -euo pipefail

: "${RUNNER_TEMP:?}"

node bin/generate_fir_boundaries.mjs 2>&1 | tee "$RUNNER_TEMP/generate.log"
