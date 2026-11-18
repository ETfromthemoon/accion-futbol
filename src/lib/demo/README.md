# Muestras para presentar al cliente

`/muestras` reúne ejemplos de formulario, noticia, newsletter y pop-up. Los datos se guardan como fixtures versionadas en `examples.ts`, de modo que la vista previa funciona sin base de datos y es igual en cada despliegue.

Son ejemplos ficticios y están marcados como tales. No crean respuestas, contactos, campañas ni publicaciones en Postgres, y no activan envíos. La muestra de newsletter representa un posible correo futuro: el módulo actual solo registra solicitudes pendientes de confirmación.

Cada pestaña del panel `/formularios` enlaza a su vista de prueba. Para mostrar contenido real guardado por el cliente se deben usar los enlaces y vistas del panel correspondientes; esas publicaciones tienen un ciclo de vida independiente de estas muestras.
