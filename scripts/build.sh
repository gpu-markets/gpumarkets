#!/usr/bin/env bash
#
# build.sh — capture site + data-repo provenance, then run `astro build`.
#
# Exports two env vars read by src/layouts/Base.astro so the footer shows
# both SHAs and the build timestamp, making every published figure
# reproducible from (site SHA, data SHA) alone.
#
#   SITE_COMMIT_SHA  — forwarded from CI (Cloudflare) or falls back to
#                      `git rev-parse HEAD` so local dev builds also show
#                      a real hash.
#   DATA_REPO_SHA    — fetched from the GitHub API's HEAD of
#                      gpu-markets/gpu-markets main; a 5-second timeout
#                      and empty-string fallback ensure the build never
#                      hangs or fails on a transient API outage.
#
# Environment variable overrides win, so CI systems or developers can
# pin a specific data-repo SHA for reproducing a historical build:
#
#   DATA_REPO_SHA=abc123 ./scripts/build.sh
#
set -euo pipefail

DATA_REPO="gpu-markets/gpu-markets"

# ---- Site SHA -------------------------------------------------------------
if [ -z "${SITE_COMMIT_SHA:-}" ]; then
  SITE_COMMIT_SHA="${CF_PAGES_COMMIT_SHA:-${WORKERS_CI_COMMIT_SHA:-}}"
  if [ -z "$SITE_COMMIT_SHA" ]; then
    SITE_COMMIT_SHA="$(git rev-parse HEAD 2>/dev/null || echo dev)"
  fi
fi
export SITE_COMMIT_SHA

# ---- Data-repo SHA --------------------------------------------------------
if [ -z "${DATA_REPO_SHA:-}" ]; then
  # GitHub API → pick `.sha` from the main-branch HEAD commit object.
  # Node is guaranteed present (this script is run from `npm run build`);
  # grep/cut would work too but JSON.parse is more robust.
  api_body="$(curl -fsS --max-time 5 "https://api.github.com/repos/${DATA_REPO}/commits/main" 2>/dev/null || true)"

  if [ -n "$api_body" ]; then
    DATA_REPO_SHA="$(printf '%s' "$api_body" | node -e '
      let buf = "";
      process.stdin.on("data", c => buf += c);
      process.stdin.on("end", () => {
        try { process.stdout.write(JSON.parse(buf).sha || ""); }
        catch { process.stdout.write(""); }
      });
    ')"
  else
    DATA_REPO_SHA=""
  fi
fi
export DATA_REPO_SHA

# ---- Provenance log (visible in build output) -----------------------------
printf '\n→ build provenance · site=%.7s · data=%.7s\n\n' \
  "${SITE_COMMIT_SHA:-dev}" \
  "${DATA_REPO_SHA:-dev}"

# ---- Hand off to astro ----------------------------------------------------
exec npx astro build
