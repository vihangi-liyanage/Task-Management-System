import { useEffect, useState, type FormEvent } from "react";
import { clearStoredToken, getStoredToken, setStoredToken } from "./lib/storage";
import { fetchCurrentUser, login, logout } from "./lib/api";
import type { AuthUser } from "./types";

export default function App() {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function hydrateSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser(token);
        if (active) {
          setUser(currentUser);
        }
      } catch {
        clearStoredToken();
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void hydrateSession();

    return () => {
      active = false;
    };
  }, [token]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await login(email.trim(), password);
      setStoredToken(response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    if (token) {
      try {
        await logout(token);
      } catch {
        // Clearing the token locally is enough for the current session.
      }
    }

    clearStoredToken();
    setToken(null);
    setUser(null);
  }

  if (loading) {
    return (
      <main className="app-shell">
        <section className="hero-card">
          <p className="eyebrow">Task Management System</p>
          <h1>Loading session...</h1>
          <p className="lead">Checking whether you already have an active session.</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="app-shell login-layout">
        <section className="hero-card login-copy">
          <p className="eyebrow">Koncepthive assessment</p>
          <h1>Task management, built with a clean foundation.</h1>
          <p className="lead">
            Login with the provided admin credentials to access the protected dashboard.
          </p>
          <div className="feature-grid">
            <article className="feature-card">JWT authentication</article>
            <article className="feature-card">PostgreSQL-backed data</article>
            <article className="feature-card">Phase-by-phase commit history</article>
            <article className="feature-card">Responsive UI scaffold</article>
          </div>
        </section>

        <section className="auth-card">
          <p className="auth-kicker">Sign in</p>
          <h2>Use the default admin account</h2>
          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {error ? <p className="error-banner">{error}</p> : null}

            <button type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="auth-footnote">
            Default credentials: <strong>admin@test.com</strong> / <strong>123456</strong>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Authenticated session</p>
          <h1>Welcome back, {user.name}</h1>
          <p className="lead">{user.email}</p>
        </div>
        <button className="ghost-button" type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="hero-card">
        <p className="eyebrow">Phase 2 complete</p>
        <h2>Auth flow and protected shell are working.</h2>
        <p className="lead">
          The next phase will connect task CRUD, dashboard summaries, search, filters, and sorting
          to the backend APIs.
        </p>
      </section>
    </main>
  );
}
