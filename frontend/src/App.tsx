import { useEffect, useState, type FormEvent } from "react";
import "./App.css";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";

const API_URL = "http://localhost:3000";

type User = {
  id: number;
  fullName: string;
  email: string;
  role: "EMPLOYEE" | "TECHNICIAN" | "ADMIN";
};

type AuthResponse = {
  user: User;
};

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [ticketRefreshKey, setTicketRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function checkAuth() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (response.ok) {
          const data: AuthResponse = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Authentication check failed:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCheckingAuth(false);
        }
      }
    }

    void checkAuth();

    return () => controller.abort();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Vnesite e-poštni naslov in geslo.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Napačen e-poštni naslov ali geslo.");
        } else {
          setError("Prijava ni uspela. Poskusite znova.");
        }
        return;
      }

      const data: AuthResponse = await response.json();

      setUser(data.user);
      setPassword("");
    } catch {
      setError("Povezava s strežnikom ni uspela.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setPassword("");
    } catch {
      setError("Odjava ni uspela. Poskusite znova.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return <main className="loading">Preverjanje prijave...</main>;
  }

  if (user) {
    return (
      <main className="dashboard">
        <header className="dashboard-header">
          <h1>FixDesk</h1>
          <button onClick={handleLogout} disabled={loading}>
            {loading ? "Odjavljanje..." : "Odjava"}
          </button>
        </header>

        <section className="welcome-card">
          <h2>Dobrodošli, {user.fullName}!</h2>
          <p>E-pošta: {user.email}</p>
          <p>Vloga: {user.role}</p>
          <p>Uspešno ste prijavljeni v FixDesk.</p>
          {error && <p className="error" role="alert">{error}</p>}
        </section>
        <TicketList
          role={user.role}
          currentUserId={user.id}
          refreshKey={ticketRefreshKey}
        />
        {user.role === "EMPLOYEE" && (
        <TicketForm
           onCreated={() => setTicketRefreshKey((key) => key + 1)}
        />
      )}
      </main>
    );
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>FixDesk</h1>
        <p className="subtitle">Sistem za IT podporo</p>

        <h2>Prijava</h2>

        <label htmlFor="email">E-poštni naslov</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ime@podjetje.si"
          autoComplete="username"
          required
        />

        <label htmlFor="password">Geslo</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Vnesite geslo"
          autoComplete="current-password"
          required
        />

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Prijavljanje..." : "Prijava"}
        </button>
      </form>
    </main>
  );
}

export default App;
