# Muestras para presentar al cliente

`/muestras` reúne ejemplos de formulario, noticia, newsletter y pop-up. Los datos se guardan como fixtures versionadas en `examples.ts`, de modo que la vista previa funciona sin base de datos y es igual en cada despliegue.

Son ejemplos ficticios y están marcados como tales. No crean respuestas, contactos, campañas ni publicaciones en Postgres, y no activan envíos. La muestra de newsletter representa un posible correo futuro: el módulo actual solo registra solicitudes pendientes de confirmación.

Cada pestaña del panel `/formularios` enlaza a su vista de prueba. Formularios, noticias y pop-ups ofrecen además **Cargar ejemplo en editor** para revisar y adaptar los mismos datos. Cargar no los guarda en Postgres: solo **Guardar borrador** o **Publicar** realiza una escritura. El newsletter muestra un concepto de correo futuro porque el panel actual no edita ni envía campañas.

El formulario de muestra incluye los seis tipos de campo disponibles, descripción e imagen de portada; la noticia usa la única imagen de portada que admite el editor; el pop-up muestra las tres plantillas con los mismos datos y un enlace funcional a la reserva. Los ejemplos no son formatos oficiales del cliente.
