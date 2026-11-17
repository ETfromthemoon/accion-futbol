# Adaptador de newsletter

La ruta `POST /api/newsletter` requiere `NEWSLETTER_ENABLED=true` y valida correo y consentimiento explícito. En `NEWSLETTER_MODE=database`, con `DATABASE_URL` y `migration.sql` aplicada, guarda una solicitud `pending_confirmation` en Postgres. El panel `/formularios` permite verla. Los envíos repetidos del mismo correo son idempotentes. Ninguna credencial se expone al navegador.

El adaptador alternativo envía `{ "email": "...", "consent": true }` a `NEWSLETTER_ENDPOINT` mediante HTTPS con `Authorization: Bearer <NEWSLETTER_TOKEN>`. El receptor debe responder 2xx solo si aceptó la solicitud. Para operar campañas hay que elegir proveedor, implementar doble confirmación y baja, y definir listas, retención y protección distribuida contra abuso. El modo de base de datos no envía correos ni considera confirmados a los contactos pendientes.
