# Demo del panel de captación

Vista previa: abrir el despliegue vigente de la rama `feat/formulario-reserva` en Vercel. Panel: `/formularios`. La contraseña es privada y no se guarda en Git. La base de demo está en el proyecto Neon `accion-futbol-preview` (`lucky-fire-83392274`) y las variables `DATABASE_URL`, `FORMS_ADMIN_PASSWORD_HASH`, `FORMS_ADMIN_SESSION_SECRET`, `NEWSLETTER_ENABLED` y `NEWSLETTER_MODE` están limitadas al entorno Preview de esta rama.

1. En **Formularios**, crear un formulario de prueba con campos, guardar borrador y publicar. Abrir el enlace `/formularios/{slug}`. Enviar datos de prueba y comprobar la respuesta en el panel. Las respuestas se guardan en Neon; la copia a Google Sheets queda pendiente hasta recibir la hoja y el webhook del cliente.
2. En el pie de la página principal, registrar un correo propio con consentimiento. En **Newsletter**, pulsar Actualizar y comprobar que aparece como `Pendiente de confirmación`. Todavía no salen campañas ni mensajes: faltan proveedor, confirmación y baja.
3. En **Noticias**, crear un borrador con título, enlace, resumen y contenido. Publicarlo y comprobar las tres superficies: bloque de novedades en la portada, archivo `/noticias` y artículo `/noticias/{slug}`. Volver a guardar como borrador para retirarlo. Estas publicaciones no generan correos.
4. En **Pop-ups**, elegir una de las tres plantillas, ruta `/`, activador por tiempo (por ejemplo, 3 segundos), imagen y enlace. Guardar borrador, revisar la vista previa de contenido y publicar. Abrir la portada en una ventana privada, esperar el activador y comprobar el aviso. Editar y guardar como borrador para retirarlo.

Antes de usar datos reales o compartir acceso permanente con el cliente: definir cuentas individuales, proveedor de newsletter, límites distribuidos de abuso, consentimiento y retención, integración con Sheets y contenido/activos aprobados. La base y la contraseña de esta demo son temporales.
