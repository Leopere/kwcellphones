#!/usr/bin/env bash
set -euo pipefail

# Refresh stock images for the site by fetching themed photos from Unsplash Source
# and converting them to WebP. This script is non-interactive.
#
# Targets (overwritten in-place):
#   techdevicerepair/images/hero-image.webp
#   techdevicerepair/images/phone-repair.webp
#   techdevicerepair/images/laptop-repair.webp
#   techdevicerepair/images/console-repair.webp
#
# Notes:
# - Uses macOS 'sips' (if available) to convert to WebP, or falls back to 'cwebp' if installed.
# - Unsplash Source returns a random but thematically relevant image per query.
# - Re-run anytime to refresh visuals.
#
# Queries can be customized via environment variables:
#   HERO_QUERY="electronics,repair,workshop"
#   PHONE_QUERY="phone,repair,technician"
#   LAPTOP_QUERY="laptop,repair,technician,workbench"
#   CONSOLE_QUERY="game,console,repair,controller"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMG_DIR="$ROOT_DIR/techdevicerepair/images"
TMP_DIR="$(mktemp -d)"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari"

mkdir -p "$IMG_DIR"

HERO_QUERY="${HERO_QUERY:-electronics,repair,workshop}"
PHONE_QUERY="${PHONE_QUERY:-phone,repair,technician}"
LAPTOP_QUERY="${LAPTOP_QUERY:-laptop,repair,technician,workbench}"
CONSOLE_QUERY="${CONSOLE_QUERY:-game,console,repair,controller}"

HERO_URL="https://source.unsplash.com/1600x900/?${HERO_QUERY}"
PHONE_URL="https://source.unsplash.com/1200x800/?${PHONE_QUERY}"
LAPTOP_URL="https://source.unsplash.com/1200x800/?${LAPTOP_QUERY}"
CONSOLE_URL="https://source.unsplash.com/1200x800/?${CONSOLE_QUERY}"

have_cmd() { command -v "$1" >/dev/null 2>&1; }

download_image() {
  local url="$1"
  local out="$2"
  echo "→ Downloading: $url"
  curl -fsSL -A "$UA" -o "$out" "$url"
}

convert_to_webp() {
  local src="$1"
  local dst="$2"
  # Prefer sips on macOS for simplicity; fallback to cwebp if present
  if have_cmd sips; then
    # Resize large images to sensible widths to keep size down
    # (sips preserves aspect ratio when only width is specified)
    local tmp_resized="${src%.*}-resized.jpg"
    sips -Z 2000 "$src" --out "$tmp_resized" >/dev/null
    sips -s format webp "$tmp_resized" --out "$dst" >/dev/null
    rm -f "$tmp_resized"
  elif have_cmd cwebp; then
    cwebp -q 82 "$src" -o "$dst" >/dev/null
  else
    echo "ERROR: Neither 'sips' nor 'cwebp' is available for WebP conversion." >&2
    echo "On macOS, 'sips' should be present. Alternatively install 'webp' tools for 'cwebp'." >&2
    exit 1
  fi
}

process_one() {
  local url="$1"
  local final_path="$2"
  local tmp_jpg="$TMP_DIR/$(basename "$final_path" .webp).jpg"
  download_image "$url" "$tmp_jpg"
  convert_to_webp "$tmp_jpg" "$final_path"
  echo "✓ Wrote $final_path"
}

echo "Refreshing stock images into: $IMG_DIR"
process_one "$HERO_URL"   "$IMG_DIR/hero-image.webp"
process_one "$PHONE_URL"  "$IMG_DIR/phone-repair.webp"
process_one "$LAPTOP_URL" "$IMG_DIR/laptop-repair.webp"
process_one "$CONSOLE_URL" "$IMG_DIR/console-repair.webp"

echo "All images refreshed."







