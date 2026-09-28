#!/usr/bin/env bash
# =============================================================================
# Self-host Mermaid for diagrams in posts.
#
# Downloads the pinned UMD build into js/mermaid.min.js. js/diagrams.js loads
# it only on pages that contain a ```mermaid block, so no other page pays for
# it and the site makes no third-party requests.
#
# Run from anywhere (Git Bash or WSL on Windows):  bash scripts/fetch-mermaid.sh
# To upgrade, change VERSION and re-run. Safe to re-run.
# =============================================================================
set -euo pipefail

VERSION="12.0.0"

cd "$(dirname "$0")/.."

echo "Fetching mermaid@${VERSION}..."
curl -fsSL "https://cdn.jsdelivr.net/npm/mermaid@${VERSION}/dist/mermaid.min.js" -o js/mermaid.min.js
echo "Wrote js/mermaid.min.js ($(wc -c < js/mermaid.min.js) bytes)"
