import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

export { corsHeaders };

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const e = v.trim().toLowerCase();
  return e.length <= 254 && EMAIL_RE.test(e) ? e : null;
};

/** Verifies the caller's JWT and admin role. Returns the service client + caller id, or an error Response. */
export async function requireAdmin(
  req: Request,
): Promise<{ admin: SupabaseClient; userId: string; email: string } | Response> {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return json({ error: "Not signed in." }, 403);
  const url = Deno.env.get("SUPABASE_URL")!;
  const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
  });
  const { data, error } = await userClient.auth.getClaims(auth.replace("Bearer ", ""));
  if (error || !data?.claims?.sub) return json({ error: "Not signed in." }, 403);
  const userId = data.claims.sub as string;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!isAdmin) return json({ error: "Admins only." }, 403);
  return { admin, userId, email: String(data.claims.email ?? "") };
}

export async function listAllUsers(admin: SupabaseClient) {
  const users: { id: string; email?: string; last_sign_in_at?: string | null; created_at: string }[] = [];
  for (let page = 1; page < 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  return users;
}
