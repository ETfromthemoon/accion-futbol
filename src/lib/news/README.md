# Noticias publicadas en el sitio

Aplicar `migration.sql` en la base Postgres configurada como `DATABASE_URL` antes de habilitar el panel. No requiere credenciales adicionales: usa la sesión administrativa existente de `/formularios`.

En la pestaña **Noticias** se puede guardar un borrador, publicarlo, editarlo y retirarlo guardándolo de nuevo como borrador. Una noticia publicada aparece entre las tres más recientes de la portada, en `/noticias` y en `/noticias/{slug}`. Los borradores no tienen acceso público. El identificador del enlace debe ser único; cambiarlo después de publicar rompe el enlace anterior.

El contenido se guarda como texto simple y se presenta como párrafos; no se interpreta HTML. La imagen es opcional y acepta una ruta local `/images/...` o una URL HTTPS. No hay carga de archivos al servidor. Las publicaciones son contenido del sitio; no activan correos del newsletter.
