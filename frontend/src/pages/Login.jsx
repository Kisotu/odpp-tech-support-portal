import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authApi } from "../services/api";
import ThemeControls from "../components/common/ThemeControls";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await authApi.login({ email, password });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundColor: "var(--ui-bg)", color: "var(--ui-text)" }}
    >
      <div className="absolute top-4 right-4">
        <ThemeControls />
      </div>

      <div className="max-w-md w-full space-y-6 sm:space-y-8 animate-fade-in-up">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-odpp-blue rounded-2xl shadow-sm flex items-center justify-center">
              <span className="text-white text-2xl font-bold">ODPP</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold" style={{ color: "var(--ui-text)" }}>
            Tech Support Portal
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: "var(--ui-text-soft)" }}>
            Office of the Director of Public Prosecutions
          </p>
        </div>

        <form
          className="mt-6 rounded-2xl p-5 sm:p-6 shadow-lg space-y-5 backdrop-blur-sm"
          style={{
            border: "1px solid var(--ui-border)",
            backgroundColor: "color-mix(in srgb, var(--ui-surface) 94%, transparent)",
            boxShadow: "var(--ui-shadow)",
          }}
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div
            className="rounded-xl shadow-sm -space-y-px overflow-hidden"
            style={{ border: "1px solid var(--ui-border)" }}
          >
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border-0 focus:outline-none focus:ring-0 focus:z-10 sm:text-sm"
                style={{
                  borderBottom: "1px solid var(--ui-border)",
                  color: "var(--ui-text)",
                  backgroundColor: "transparent",
                }}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border-0 focus:outline-none focus:ring-0 focus:z-10 sm:text-sm"
                style={{
                  color: "var(--ui-text)",
                  backgroundColor: "transparent",
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-odpp-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-odpp-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center text-sm" style={{ color: "var(--ui-text-soft)" }}>
            Contact ICT support if you cannot access your account.
          </div>
        </form>

        <div
          className="mt-2 p-4 rounded-xl border text-sm"
          style={{
            color: "var(--ui-text-muted)",
            borderColor: "color-mix(in srgb, var(--accent-500) 22%, var(--ui-border) 78%)",
            backgroundColor: "color-mix(in srgb, var(--accent-500) 10%, var(--ui-surface) 90%)",
          }}
        >
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs">Admin: admin@odpp.go.ke / password</p>
          <p className="text-xs">ICT Officer: ict1@odpp.go.ke / password</p>
          <p className="text-xs">Staff: prosecutor@odpp.go.ke / password</p>
        </div>
      </div>
    </div>
  );
}
