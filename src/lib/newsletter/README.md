# Adaptador de newsletter

La ruta `POST /api/newsletter` está desactivada por defecto; requiere `NEWSLETTER_ENABLED=true`. Valida correo y consentimiento explícito. El adaptador envía `{ "email": "...", "consent": true }` a `NEWSLETTER_ENDPOINT` mediante HTTPS con `Authorization: Bearer <NEWSLETTER_TOKEN>`; el servicio receptor debe responder 2xx solo si aceptó la solicitud. Sin ambos valores, o si el receptor falla, la ruta devuelve 503. Ninguna credencial se expone al navegador.

El proveedor y el servicio receptor aún deben acordarse. Antes de habilitar el formulario público, implementar protección distribuida contra abuso y doble confirmación, y definir mecanismo de baja, conservación del consentimiento y gestión de listas y campañas. Este adaptador no envía campañas ni implementa esas funciones. El pie de página muestra el formulario únicamente cuando el indicador está activado y ambas variables existen durante el renderizado.
