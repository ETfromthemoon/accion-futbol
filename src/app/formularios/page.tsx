export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { FormsAdmin } from "@/components/form-builder/forms-admin";
import { FORMS_ADMIN_COOKIE, isFormsAdminConfigured, isValidAdminSession } from "@/lib/forms/admin-auth";

export default async function FormsAdminPage() {
  const configured = isFormsAdminConfigured();
  const cookieStore = await cookies();
  const authenticated = isValidAdminSession(cookieStore.get(FORMS_ADMIN_COOKIE)?.value);
  return <main className="mx-auto max-w-6xl px-6 py-20">
    <h1 className="mb-8 text-3xl font-bold">Panel de administración</h1>
    {!configured ? <p className="rounded-xl border border-border p-4">El panel permanece cerrado. Configura las variables de autenticación descritas en <code>src/lib/forms/README.md</code>.</p> : <FormsAdmin authenticated={authenticated} />}
  </main>;
}
