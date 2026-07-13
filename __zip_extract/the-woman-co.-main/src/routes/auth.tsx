import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — The Woman Company" }] }),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) nav({ to: "/profile" }); }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Welcome — check your inbox to confirm your account.");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        nav({ to: "/profile" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/auth" });
        if (error) throw error;
        toast.success("Reset link sent to your email");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setBusy(false); }
  };

  const google = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) toast.error("Google sign-in failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-luxury border border-border bg-card">
        <div className="relative hidden md:block">
          <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&q=80" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-black/30" />
          <div className="absolute bottom-6 left-6 right-6 text-primary-foreground">
            <div className="font-display text-2xl">Welcome to your ritual</div>
            <p className="text-sm opacity-90 mt-1">Track orders, save favourites, unlock members-only offers.</p>
          </div>
        </div>
        <div className="p-8 md:p-10">
          <div className="flex gap-2 text-sm">
            {[
              { id: "signin", label: "Sign in" }, { id: "signup", label: "Create account" },
            ].map((t) => (
              <button key={t.id} onClick={() => setMode(t.id as typeof mode)}
                className={`px-4 py-1.5 rounded-full transition ${mode === t.id ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={submit}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6 space-y-3"
            >
              <h1 className="font-display text-2xl">
                {mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back"}
              </h1>
              {mode === "signup" && (
                <Field icon={<UserIcon className="h-4 w-4" />}>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full bg-transparent outline-none text-sm" />
                </Field>
              )}
              <Field icon={<Mail className="h-4 w-4" />}>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent outline-none text-sm" />
              </Field>
              {mode !== "forgot" && (
                <Field icon={<Lock className="h-4 w-4" />}>
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" minLength={6} className="w-full bg-transparent outline-none text-sm" />
                </Field>
              )}
              {mode === "signin" && (
                <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">Forgot password?</button>
              )}
              <button disabled={busy} type="submit" className="btn-luxury btn-luxury-hover w-full">
                {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
                <ArrowRight className="h-4 w-4" />
              </button>

              {mode !== "forgot" && (
                <>
                  <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex-1 h-px bg-border" /> or continue with <div className="flex-1 h-px bg-border" />
                  </div>
                  <button type="button" onClick={google} disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm hover:bg-accent/40 transition">
                    <GoogleIcon /> Continue with Google
                  </button>
                </>
              )}

              {mode === "forgot" && (
                <button type="button" onClick={() => setMode("signin")} className="text-xs text-muted-foreground hover:text-primary">
                  ← Back to sign in
                </button>
              )}
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-muted px-4 h-12 focus-within:ring-2 focus-within:ring-primary/40">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  );
}
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
  );
}
