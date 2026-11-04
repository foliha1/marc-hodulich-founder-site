import { corsHeaders, json, listAllUsers, normalizeEmail, requireAdmin } from "../_shared/admin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);
  try {
    const ctx = await requireAdmin(req);
    if (ctx instanceof Response) return ctx;
    const { admin, userId } = ctx;

    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body?.email);
    if (!email) return json({ error: "Please provide a valid email." }, 400);

    const target = (await listAllUsers(admin)).find((u) => u.email?.toLowerCase() === email);
    if (target?.id === userId) return json({ error: "You can't remove yourself." }, 400);

    if (target) {
      const { data: admins, error } = await admin.from("user_roles").select("user_id").eq("role", "admin");
      if (error) throw error;
      const isAdmin = admins.some((r) => r.user_id === target.id);
      if (isAdmin && admins.length <= 1) return json({ error: "You can't remove the last admin." }, 400);
      const { error: delErr } = await admin
        .from("user_roles").delete().eq("user_id", target.id).eq("role", "admin");
      if (delErr) throw delErr;
    }
    const { error: preErr } = await admin.from("pre_approved_admins").delete().ilike("email", email);
    if (preErr) throw preErr;
    return json({ message: `${email} is no longer an admin.` });
  } catch (e) {
    console.error("remove-admin failed", e instanceof Error ? e.message : e);
    return json({ error: "Something went wrong removing the admin." }, 500);
  }
});
