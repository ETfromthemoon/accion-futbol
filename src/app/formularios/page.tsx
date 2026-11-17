export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { FormsAdmin } from "@/components/form-builder/forms-admin";
import { FORMS_ADMIN_COOKIE, isFormsAdminConfigured, isValidAdminSession } from "@/lib/forms/admin-auth";
import Link from "next/link";
import "./admin.css";

export default async function FormsAdminPage() {
  const configured = isFormsAdminConfigured();
  const cookieStore = await cookies();
  const authenticated = isValidAdminSession(cookieStore.get(FORMS_ADMIN_COOKIE)?.value);
  return <main className="admin-shell">
    <header className="admin-masthead">
      <div>
        <p className="admin-eyebrow">ACCIÓN FÚTBOL / GESTIÓN</p>
        <h1>Panel de administración</h1>
        <p>Organiza tus formularios, newsletter y pop-ups desde un solo lugar.</p>
      </div>
      <Link className="admin-site-link" href="/">Ver sitio <span aria-hidden="true">↗</span></Link>
    </header>
    {!configured ? <p className="admin-panel">El panel permanece cerrado. Configura las variables de autenticación descritas en <code>src/lib/forms/README.md</code>.</p> : <FormsAdmin authenticated={authenticated} sheetsConfigured={Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL && process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN)} />}
  </main>;
}
