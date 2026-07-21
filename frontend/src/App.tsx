import { useEffect, useState, type FormEvent } from "react";
import { clearStoredToken, getStoredToken, setStoredToken } from "./lib/storage";
import { fetchCurrentUser, login, logout } from "./lib/api";
import type { AuthUser } from "./types";
import { DashboardScreen } from "./components/DashboardScreen";
import { getStoredTheme, storeTheme, type ThemeMode } from "./lib/theme";
import { SunIcon, MoonIcon, EyeIcon } from "./components/icons";

export default function App() {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    storeTheme(theme);
  }, [theme]);

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

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  function togglePasswordVisibility() {
    setShowPassword((current) => !current);
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
          <div className="hero-decor" aria-hidden="true">
            <span className="hero-orb hero-orb-a" />
            <span className="hero-orb hero-orb-b" />
            <span className="hero-gridline hero-gridline-a" />
            <span className="hero-gridline hero-gridline-b" />
          </div>
          <p className="eyebrow">Task Management System</p>
          <h1>Manage Your Tasks. Achieve Your Goals.</h1>
          <p className="lead hero-copy">
            Stay organized, focused, and productive with a simple task management system designed
            to help you manage your daily work efficiently. Create tasks, set priorities, track
            progress, and stay on top of your deadlines all in one place.
          </p>
        </section>

        <section className="auth-card">
          <div className="card-topline">
            <p className="auth-kicker">Sign in</p>
            <button
              className="ghost-button icon-button"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="button-icon" aria-hidden="true">
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </span>
            </button>
          </div>
          <h2>Sign in to continue</h2>
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
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  <EyeIcon hidden={showPassword} />
                </button>
              </div>
            </label>

            {error ? <p className="error-banner">{error}</p> : null}

            <button type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <DashboardScreen
      token={token}
      user={user}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={handleLogout}
    />
  );
}
