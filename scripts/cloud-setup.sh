#!/bin/bash
# cloud-setup.sh — make all cv skills + the understand-anything plugin available
# in any Claude Code cloud session.
#
# Two ways to use it (pick one):
#   1. Environment Setup script  (claude.ai → environment selector → "Setup script"
#      field): works for ANY repo you open in that environment, result is cached.
#      Paste the contents of this file there.
#   2. As a SessionStart hook in any repo's .claude/settings.json (cloud + local).
#
# Idempotent and safe to run repeatedly. Non-critical steps use `|| true` so a
# flaky network never blocks session start.
set -uo pipefail

SKILLS_DST="$HOME/.claude/skills"
PLUGIN_DST="$HOME/.understand-anything-plugin"
mkdir -p "$SKILLS_DST"

# --- locate the skill source: prefer the cloned repo, else fetch cv ---
SRC=""
if [ -d "${CLAUDE_PROJECT_DIR:-}/.claude/skills" ]; then
  SRC="$CLAUDE_PROJECT_DIR/.claude"
else
  REPO="https://github.com/MrRainbow10/cv"
  # GH_TOKEN (set it in the environment's variables) is only needed if cv is private
  [ -n "${GH_TOKEN:-}" ] && REPO="https://x-access-token:${GH_TOKEN}@github.com/MrRainbow10/cv"
  rm -rf /tmp/cv-skills
  if git clone --depth 1 "$REPO" /tmp/cv-skills 2>/dev/null; then
    SRC="/tmp/cv-skills/.claude"
  fi
fi

if [ -z "$SRC" ]; then
  echo "cloud-setup: could not find or fetch skills (set GH_TOKEN if cv is private)" >&2
  exit 0   # don't block the session
fi

# --- install all skills at user level ---
cp -r "$SRC"/skills/* "$SKILLS_DST"/ 2>/dev/null || true
echo "cloud-setup: installed $(ls -1 "$SKILLS_DST" | wc -l) skills into $SKILLS_DST"

# --- understand-anything plugin: vendor source, build core, expose skills for module resolution ---
if [ -d "$SRC/understand-anything" ]; then
  rm -rf "$PLUGIN_DST"
  cp -r "$SRC/understand-anything" "$PLUGIN_DST"
  # the .mjs scripts import @understand-anything/core, which only resolves when they
  # sit under the plugin's node_modules tree — so copy the understand skills back in.
  mkdir -p "$PLUGIN_DST/skills"
  for s in understand understand-chat understand-dashboard understand-diff \
           understand-domain understand-explain understand-knowledge understand-onboard; do
    [ -d "$SRC/skills/$s" ] && cp -r "$SRC/skills/$s" "$PLUGIN_DST/skills/$s"
  done
  if command -v pnpm >/dev/null 2>&1; then
    ( cd "$PLUGIN_DST" && pnpm install >/dev/null 2>&1 \
        && pnpm --filter @understand-anything/core build >/dev/null 2>&1 ) || true
    [ -f "$PLUGIN_DST/packages/core/dist/index.js" ] \
      && echo "cloud-setup: understand-anything core built" \
      || echo "cloud-setup: understand core build skipped/failed (needs Node>=22 + network)" >&2
  fi
fi
exit 0
