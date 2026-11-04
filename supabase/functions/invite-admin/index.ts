import { corsHeaders, json, listAllUsers, normalizeEmail, requireAdmin } from "../_shared/admin.ts";

const ALLOWED_ORIGINS = [
  "https://id-preview--24c4c8dd-c8dd-498a-ac3c-c420118eb591.lovable.app",
  "https://marc-hodulich-founder-site.lovable.app",
  "https://marchodulich.com",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);
  try {
    const ctx = await requireAdmin(req);
    if (ctx instanceof Response) return ctx;
    const { admin } = ctx;

    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body?.email);
    if (!email) return json({ error: "Please enter a valid email address." }, 400);

    const origin = req.headers.get("origin") ?? "";
    const base = ALLOWED_ORIGINS.includes(origin) ? origin : "https://marchodulich.com";

    const { error: preErr } = await admin
      .from("pre_approved_admins")
      .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
    if (preErr) throw preErr;

    const existing = (await listAllUsers(admin)).find((u) => u.email?.toLowerCase() === email);
    if (existing) {
      const { error } = await admin
        .from("user_roles")
        .upsert({ user_id: existing.id, role: "admin" }, { onConflict: "user_id,role", ignoreDuplicates: true });
      if (error) throw error;
      return json({ status: "existing", message: "Already has an account. They can sign in at /auth." });
    }

    const { error: invErr } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: `${base}/admin` });
    if (invErr) return json({ error: `Could not send invite: ${invErr.message}` }, 400);
    return json({ status: "invited", message: `Invite email sent to ${email}.` });
  } catch (e) {
    console.error("invite-admin failed", e instanceof Error ? e.message : e);
    return json({ error: "Something went wrong sending the invite." }, 500);
  }
});
