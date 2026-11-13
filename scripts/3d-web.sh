#!/bin/zsh
# Convierte los renders del 3D (PNG 2048 transparentes, ~/Desktop/agroincol-3d) a los tamaños web
# del sitio: 512 y 1024 px de ancho, AVIF (principal) y WebP (respaldo), en public/images/3d/.
#   scripts/3d-web.sh casa B frente34 picado
# Uso de srcset por ancho (512w/1024w): los objetos se muestran a ~200-400 px CSS.
set -euo pipefail
obj=$1; var=$2; shift 2
SRC=~/Desktop/agroincol-3d/$obj/render/png
DST=public/images/3d
for pose in "$@"; do
  png=$SRC/${obj}_${var}_${pose}.png
  for w in 512 1024; do
    magick "$png" -resize ${w}x${w} -quality 60 "$DST/${obj}-${pose}-${w}.avif"
    magick "$png" -resize ${w}x${w} -define webp:alpha-quality=90 -quality 78 "$DST/${obj}-${pose}-${w}.webp"
  done
done
ls -la $DST | grep "$obj"
