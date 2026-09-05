import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Landmark, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — TSHAY BANK Branch Performance System" },
      {
        name: "description",
        content: "Secure sign in for TSHAY BANK branch staff to manage goals, targets and daily banking activities.",
      },
      { property: "og:title", content: "Sign in — TSHAY BANK Branch Performance System" },
      {
        property: "og:description",
        content: "Secure sign in for TSHAY BANK branch staff to manage goals, targets and daily banking activities.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard" });
  }, [ready, user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof fieldErrors = {};
    if (!username.trim()) errs.username = "Username is required.";
    if (!password) errs.password = "Password is required.";
    setFieldErrors(errs);
    setError(null);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(username, password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col lg:flex-row">
        <aside className="relative hidden flex-1 flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
            aria-hidden
          />
          <div className="relative flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-sidebar-accent ring-1 ring-sidebar-border">
              <Landmark className="size-6 text-sidebar-accent-foreground" />
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-wide text-sidebar-accent-foreground">
                TSHAY BANK
              </span>
              <span className="block text-xs text-sidebar-foreground/70">Branch Performance System</span>
            </span>
          </div>
          <div className="relative max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-sidebar-accent-foreground">
              Measure branch performance with confidence.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/80">
              Track deposits, customer growth and digital banking targets for every employee — conventional and
              interest free banking, in one place.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["25M ETB", "Deposit mobilized"],
                ["1,240", "Customers served"],
                ["78%", "Target achievement"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="num text-xl font-bold text-sidebar-accent-foreground">{v}</p>
                  <p className="text-[11px] text-sidebar-foreground/70">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="relative inline-flex items-center gap-2 text-xs text-sidebar-foreground/70">
            <ShieldCheck className="size-4" /> Secured branch access · Authorized staff only
          </p>
        </aside>

        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl bg-primary">
                <Landmark className="size-5 text-primary-foreground" />
              </span>
              <span>
                <span className="block text-base font-extrabold tracking-wide text-foreground">TSHAY BANK</span>
                <span className="block text-xs text-muted-foreground">Branch Performance System</span>
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
              <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your account.</p>

              {error && (
                <Alert variant="destructive" className="mt-5">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin"
                    autoComplete="username"
                    aria-invalid={!!fieldErrors.username}
                  />
                  {fieldErrors.username && (
                    <p className="text-xs font-medium text-destructive">{fieldErrors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="pr-11"
                      aria-invalid={!!fieldErrors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-secondary"
                    >
                      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs font-medium text-destructive">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox id="remember" /> Remember me
                  </label>
                  <a href="#" className="text-sm font-semibold text-accent hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={loading}>
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  {loading ? "Signing in..." : "LOGIN"}
                </Button>
              </form>

              <div className="mt-6 rounded-lg border border-dashed border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Prototype accounts</p>
                <p className="mt-1">Branch Admin — username: admin · password: admin123</p>
                <p>Employee — username: abebe · password: abebe123</p>
              </div>
            </div>

            <footer className="mt-8 text-center text-xs text-muted-foreground">
              <p>© 2026 TSHAY BANK S.C. · Branch Performance System v1.0</p>
              <p className="mt-1">Privacy Policy · Terms of Use · Support</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
