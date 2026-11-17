# Pop-ups administrables

Aplicar `migration.sql` y configurar `DATABASE_URL`. El panel `/formularios` permite guardar borradores y publicar avisos con plantilla clásica, imagen dividida o aviso compacto. Cada aviso tiene ruta exacta o todas las páginas públicas, activador de tiempo/scroll/salida en escritorio, frecuencia en días, fechas opcionales, imagen local `/images/...` o HTTPS, y enlace seguro. La vista previa de contenido del panel no publica el aviso. Para retirarlo, editarlo y guardar como borrador.

`GET /api/popups?path=/` entrega solo avisos publicados, vigentes y correspondientes a la ruta; el componente global muestra a lo sumo uno y recuerda el cierre en el navegador. La ruta administrativa `/formularios` nunca muestra avisos. No hay carga de imágenes ni segmentación por usuario en esta entrega.
