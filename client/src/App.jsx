import { useState } from "react";
import { apiRequest } from "./services/api";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./Dashboard.jsx";

function App() {
  const { token, login, logout } = useAuth();

  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = page === "register";

  function switchPage(nextPage) {
    setPage(nextPage);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const path = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (isRegister) {
        if (data.token) {
          login(data.token);
        } else {
          switchPage("login");
          setMessage("Registration successful! Please log in.");
        }
      } else {
        if (!data.token) {
          throw new Error("Login response did not contain a token.");
        }

        login(data.token);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (token) {
  return <Dashboard />;
  }

  return (
    <main className="auth-card">
      <h1 className="auth-brand">TaskTrack</h1>
      <p className="auth-tagline">Your personal task manager</p>

      <div className="auth-tabs">
        <button
          type="button"
          onClick={() => switchPage("login")}
          disabled={!isRegister}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => switchPage("register")}
          disabled={isRegister}
        >
          Register
        </button>
      </div>

      <h2 className="auth-title">{isRegister ? "Create an account" : "Welcome back"}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {isRegister && (
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </div>

        {isRegister && (
          <div className="field">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              minLength={6}
              required
            />
          </div>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading
            ? "Please wait..."
            : isRegister
              ? "Create account"
              : "Login"}
        </button>
      </form>

      {message && <p role="status" className="alert alert-success">{message}</p>}
      {error && <p role="alert" className="alert alert-error">{error}</p>}

      <p className="auth-switch">
        {isRegister
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <button
          type="button"
          className="link-btn"
          onClick={() =>
            switchPage(isRegister ? "login" : "register")
          }
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </main>
  );
}

export default App;