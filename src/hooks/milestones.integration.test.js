import { describe, expect, test } from "bun:test";
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Public backend configuration is required for milestone integration tests.");
const publicClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

describe("milestone access", () => {
  test("visitors can read milestones", async () => {
    const { error, data } = await publicClient.from("entrepreneurial_milestones").select("id");
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  test("anonymous visitors cannot edit milestones", async () => {
    const { data: rows, error: readError } = await publicClient.from("entrepreneurial_milestones").select("id, contextual_label").limit(1);
    expect(readError).toBeNull();
    const row = rows?.[0];
    if (!row) throw new Error("A milestone is required to verify edit protection.");
    const { data } = await publicClient.from("entrepreneurial_milestones")
      .update({ contextual_label: row.contextual_label }).eq("id", row.id).select("id");
    expect(data ?? []).toEqual([]);
  });
});