import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type AdminRow = { email: string; last_sign_in_at: string | null; is_self: boolean };
type PendingRow = { email: string };

async function errorMessage(error: unknown): Promise<string> {
  const ctx = (error as { context?: Response })?.context;
  if (ctx && typeof ctx.json === "function") {
    try { const b = await ctx.json(); if (b?.error) return b.error; } catch { /* ignore */ }
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}

export const AdminsEditor = () => {
  const [admins, setAdmins] = useState<AdminRow[] | null>(null);
  const [pending, setPending] = useState<PendingRow[]>([]);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase.functions.invoke("list-admins");
    if (error) {
      toast({ variant: "destructive", title: "Error", description: await errorMessage(error) });
      return;
    }
    setAdmins(data.admins);
    setPending(data.pending);
  };

  useEffect(() => { load(); }, []);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    const { data, error } = await supabase.functions.invoke("invite-admin", { body: { email } });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: await errorMessage(error) });
    } else {
      toast({ title: "Success", description: data.message });
      setEmail("");
      load();
    }
    setInviting(false);
  };

  const remove = async (target: string) => {
    const { data, error } = await supabase.functions.invoke("remove-admin", { body: { email: target } });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: await errorMessage(error) });
    } else {
      toast({ title: "Removed", description: data.message });
      load();
    }
  };

  const RemoveButton = ({ target }: { target: string }) => (
    <Button variant="outline" size="sm" onClick={() => {
      if (window.confirm(`Remove ${target} as an admin? They will no longer be able to use the dashboard.`)) remove(target);
    }}>Remove</Button>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Invite Admin</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={invite} className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <Label htmlFor="invite-email">Email</Label>
              <Input id="invite-email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
            <Button type="submit" disabled={inviting}>{inviting ? "Sending..." : "Invite admin"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Current Admins</CardTitle></CardHeader>
        <CardContent>
          {!admins ? <div>Loading...</div> : (
            <ul className="divide-y">
              {admins.map((a) => (
                <li key={a.email} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{a.email}{a.is_self && " (you)"}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.last_sign_in_at
                        ? `Last signed in ${new Date(a.last_sign_in_at).toLocaleDateString()}`
                        : "Invited, not signed in yet"}
                    </p>
                  </div>
                  {!a.is_self && <RemoveButton target={a.email} />}
                </li>
              ))}
              {pending.map((p) => (
                <li key={p.email} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.email}</p>
                    <p className="text-sm text-muted-foreground">Pre-approved, no account yet</p>
                  </div>
                  <RemoveButton target={p.email} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
