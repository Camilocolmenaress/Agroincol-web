#!/usr/bin/env bash
# Copias estáticas de las figuras 3D (public/rediseno/obj-*.webp) en 300, 450 y 600 px, con el canal
# alfa sin pérdida (webp:exact, alpha-quality=100). Se sirven directas, sin /_next/image: la
# recompresión del optimizador a AVIF ensuciaba el alfa y el drop-shadow lo volvía un cuadro en iPhone.
# Uso: bash scripts/rediseno/figuras.sh   (requiere ImageMagick 7)
set -euo pipefail
cd "$(dirname "$0")/../../public/rediseno"
for f in obj-*.webp; do
  case "$f" in *-[0-9][0-9][0-9].webp) continue ;; esac
  base="${f%.webp}"
  for w in 300 450 600; do
    magick "$f" -resize "${w}x${w}" -define webp:exact=true -define webp:alpha-quality=100 \
      -define webp:alpha-filter=best -quality 82 "${base}-${w}.webp"
  done
done
echo "listo: $(ls obj-*-[0-9][0-9][0-9].webp | wc -l | tr -d ' ') copias"
