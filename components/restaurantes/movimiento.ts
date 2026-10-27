// Las animaciones de Motion se cargan DESPUÉS del primer pantallazo: el
// formulario pinta con ~5 KB de Motion y este paquete (~24 KB) llega aparte.
// En el navegador de Instagram con datos móviles eso es la diferencia entre
// que la primera pregunta aparezca ya o medio segundo después.
export { domAnimation as default } from 'motion/react';
