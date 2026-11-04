import { corsHeaders, json, listAllUsers, requireAdmin } from "../_shared/admin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const ctx = await requireAdmin(req);
    if (ctx instanceof Response) return ctx;
    const { admin, userId } = ctx;

    const [{ data: roles, error: rErr }, { data: pre, error: pErr }, users] = await Promise.all([
      admin.from("user_roles").select("user_id").eq("role", "admin"),
      admin.from("pre_approved_admins").select("email, created_at"),
      listAllUsers(admin),
    ]);
    if (rErr) throw rErr;
    if (pErr) throw pErr;

    const adminIds = new Set(roles.map((r) => r.user_id));
    const admins = users
      .filter((u) => adminIds.has(u.id))
      .map((u) => ({
        email: u.email ?? "",
        last_sign_in_at: u.last_sign_in_at ?? null,
        is_self: u.id === userId,
      }))
      .sort((a, b) => a.email.localeCompare(b.email));

    const userEmails = new Set(users.map((u) => u.email?.toLowerCase()));
    const pending = pre
      .filter((p) => !userEmails.has(p.email.toLowerCase()))
      .map((p) => ({ email: p.email, created_at: p.created_at }));

    return json({ admins, pending });
  } catch (e) {
    console.error("list-admins failed", e instanceof Error ? e.message : e);
    return json({ error: "Could not load admins." }, 500);
  }
});
