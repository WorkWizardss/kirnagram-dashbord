import { FormEvent, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateAdminCredentials, isAdminAuthenticated, setAdminAuthenticated } from "@/lib/adminAuth";
import {
  validateAgentCredentials,
  isAgentAuthenticated,
  setAgentAuthenticated,
  getAuthenticatedAgent,
} from "@/lib/agentAuth";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (isAdminAuthenticated()) {
    navigate("/", { replace: true });
    return null;
  }

  if (isAgentAuthenticated()) {
    navigate("/", { replace: true });
    return null;
  }

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null;
    return state?.from?.pathname || "/";
  }, [location.state]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // Try admin login first
    if (validateAdminCredentials(email, password)) {
      setAdminAuthenticated(true);
      setIsLoading(false);
      navigate(redirectPath, { replace: true });
      return;
    }

    // Try agent login
    const agent = validateAgentCredentials(email, password);
    if (agent) {
      setAgentAuthenticated(agent.id);
      toast.success(`Welcome, ${agent.username}!`);
      setIsLoading(false);
      navigate(redirectPath, { replace: true });
      return;
    }

    setError("Invalid email or password.");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-display font-bold">Dashboard Login</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in with admin or agent credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="admin@kirnagrma or agent email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
