import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address.");
const RESEND_SECONDS = 60;

/** Turn auth errors into plain messages. */
export const friendlyAuthError = (error: { message?: string; code?: string; status?: number }) => {
  const msg = (error.message || "").toLowerCase();
  const code = error.code || "";
  if (code === "otp_disabled" || msg.includes("signups not allowed") || msg.includes("user not found")) {
    return "That email doesn't have access.";
  }
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit" || error.status === 429 || msg.includes("rate limit") || msg.includes("security purposes")) {
    return "Too many login links were requested. Please wait a minute and try again.";
  }
  if (code === "otp_expired" || msg.includes("expired") || msg.includes("invalid")) {
    return "That login link has expired or was already used. Request a new one below.";
  }
  return "Something went wrong sending your login link. Please try again.";
};

const readLinkError = () => {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, "") || window.location.search);
  const code = params.get("error_code");
  const description = params.get("error_description");
  if (!code && !description) return null;
  return friendlyAuthError({ code: code || undefined, message: description || "" });
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(() => readLinkError());
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/admin");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendLink = async () => {
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    setLoading(false);
    if (error) {
      setError(friendlyAuthError(error));
      return;
    }
    setSent(true);
    setCooldown(RESEND_SECONDS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendLink();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-warm p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            {sent ? "Login link sent" : "Enter your email and we'll send you a login link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4" role="status">
              <p className="text-sm text-foreground">
                Check your email for a login link. You can close this tab.
              </p>
              <p className="text-sm text-muted-foreground">Sent to {email.trim()}</p>
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={sendLink}
                disabled={loading || cooldown > 0}
              >
                {loading ? "Sending..." : cooldown > 0 ? `Send again (${cooldown}s)` : "Send again"}
              </Button>
              <button
                type="button"
                className="w-full text-sm text-brand-ink hover:underline"
                onClick={() => { setSent(false); setError(null); }}
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send login link"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
