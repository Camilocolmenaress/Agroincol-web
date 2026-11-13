#!/usr/bin/env python3
# Agrega un objeto 3D ya convertido (scripts/3d-web.sh) al desfile: components/recorrido/objetos.ts
#   python3 -I scripts/integrar-objeto.py <id> "<alt>" <href>
import sys
idd, alt, href = sys.argv[1:4]
p = 'components/recorrido/objetos.ts'
s = open(p).read()
if f"id: '{idd}'" in s:
    sys.exit(f'{idd} ya está')
fin = s.index('];', s.index('export const OBJETOS'))
entrada = f"  {{\n    id: '{idd}',\n    alt: '{alt}',\n    href: '{href}',\n  }},\n"
s = s[:fin] + entrada + s[fin:]
open(p, 'w').write(s)
print('integrado', idd)
