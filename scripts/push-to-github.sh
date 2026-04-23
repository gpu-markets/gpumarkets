#!/usr/bin/env bash
# push-to-github.sh
#
# One-shot setup: clean any partial .git, init fresh, commit Phase 1, and push
# to GitHub. Safe to re-run — the rm -rf only removes a local .git directory,
# not anything on GitHub.
#
# Usage:
#   cd ~/GPU\ Market/gpu-markets-site
#   bash scripts/push-to-github.sh
#
# Prereqs:
#   - git installed
#   - Either (a) `gh` CLI installed and authenticated (`gh auth login`), or
#     (b) you've already created the empty repo on github.com manually and
#         set REMOTE_URL below.

set -euo pipefail

# ----------- config -----------
REPO_NAME="${REPO_NAME:-gpumarkets.dev}"
VISIBILITY="${VISIBILITY:-private}"   # private | public
GIT_USER_NAME="${GIT_USER_NAME:-John Jung}"
GIT_USER_EMAIL="${GIT_USER_EMAIL:-john@gpumarkets.dev}"
# If you've created the repo manually, set this and the script will skip `gh repo create`:
REMOTE_URL="${REMOTE_URL:-}"
# ------------------------------

cd "$(dirname "$0")/.."
PROJECT_DIR="$(pwd)"
echo "[1/6] Project dir: $PROJECT_DIR"

# Sanity check — this should be the gpu-markets-site root
if [[ ! -f "package.json" || ! -f "astro.config.mjs" ]]; then
  echo "ERROR: this doesn't look like the gpu-markets-site root (no package.json + astro.config.mjs)."
  exit 1
fi

# Wipe any partial .git left behind by the sandbox
if [[ -d ".git" ]]; then
  echo "[2/6] Removing existing .git directory..."
  rm -rf .git
fi

echo "[3/6] git init + initial commit"
git init -b main
git config user.name  "$GIT_USER_NAME"
git config user.email "$GIT_USER_EMAIL"
git add -A
git commit -m "Phase 1 — Astro port of GPU Markets site

Landing page composed of 11 sections, 4 Phase-2 stub pages,
shared design system in public/shared.css (934 lines extracted
verbatim), vanilla-JS hero chart + row-toggle, and a README
covering local dev, design constraints, and Cloudflare deployment
deployment settings.

Stack: Astro 5 (static output), TypeScript strict, no CSS
framework. All 5 pages build cleanly (astro build + astro check)."

echo "[4/6] Configuring remote"
if [[ -n "$REMOTE_URL" ]]; then
  echo "  Using REMOTE_URL=$REMOTE_URL"
  git remote add origin "$REMOTE_URL"
elif command -v gh >/dev/null 2>&1; then
  echo "  Creating GitHub repo via gh CLI ($VISIBILITY)..."
  # `gh repo create` will pick the authenticated user as owner unless OWNER/REPO is given.
  # Adjust `--public` / `--private` via VISIBILITY var.
  gh repo create "$REPO_NAME" \
    "--$VISIBILITY" \
    --source=. \
    --remote=origin \
    --description="The public site for GPU Markets — an open reference price index for the GPU rental market."
else
  cat <<'MSG'
ERROR: no REMOTE_URL set and `gh` CLI is not installed.

Two fixes:
  (A) Install gh:  brew install gh && gh auth login   then re-run this script.
  (B) Create the repo manually on github.com (empty, no README/license),
      then re-run with:
        REMOTE_URL=git@github.com:YOUR_USER/gpumarkets.dev.git bash scripts/push-to-github.sh
MSG
  exit 1
fi

echo "[5/6] Pushing to origin/main"
git push -u origin main

echo "[6/6] Done."
echo
echo "Next: connect this repo to Cloudflare Workers Builds."
echo "  Build command:  npm run build"
echo "  Build output:   dist"
echo "  Node version:   20.x"
echo "  Custom domain:  gpumarkets.dev"
