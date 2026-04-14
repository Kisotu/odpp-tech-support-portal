import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Button from "./Button";
import ThemeControls from "./ThemeControls";

export default function Navigation() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const getNavigation = () => {
    const baseNav = [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Tickets", href: "/tickets" },
    ];

    if (user?.role === "ict_officer" || user?.role === "admin") {
      return [
        ...baseNav,
        { name: "ICT Dashboard", href: "/ict-dashboard" },
        { name: "Reports", href: "/reports" },
        { name: "Knowledge Base", href: "/knowledge-base" },
      ];
    }

    return [
      ...baseNav,
      { name: "Knowledge Base", href: "/knowledge-base" },
    ];
  };

  const navigation = getNavigation();

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-lg transition-colors duration-300"
      style={{
        borderBottom: "1px solid var(--ui-border)",
        backgroundColor: "color-mix(in srgb, var(--ui-surface) 88%, transparent)",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-lg px-2 py-1 transition-all duration-200"
              style={{ color: "var(--ui-text)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: "var(--accent-500)" }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="block text-base font-bold tracking-tight" style={{ color: "var(--ui-text)" }}>ODPP Support</span>
                <span className="hidden sm:block text-xs" style={{ color: "var(--ui-text-soft)" }}>ICT Help Desk</span>
              </div>
            </Link>

            <nav
              className="hidden md:flex items-center gap-1 rounded-xl p-1 shadow-sm"
              style={{
                border: "1px solid var(--ui-border)",
                backgroundColor: "color-mix(in srgb, var(--ui-surface) 92%, transparent)",
              }}
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-white shadow-sm"
                      : "hover:bg-gray-100"
                  }`}
                  style={
                    isActive(item.href)
                      ? { backgroundColor: "var(--accent-500)" }
                      : { color: "var(--ui-text-muted)" }
                  }
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeControls />

            <div className="text-right">
              <div className="text-sm font-medium max-w-36 truncate" style={{ color: "var(--ui-text)" }}>
                {user?.name}
              </div>
              <div className="text-xs capitalize" style={{ color: "var(--ui-text-soft)" }}>
                {user?.role?.replace("_", " ")}
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-xl">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="ml-2">Logout</span>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeControls compact />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className={`hamburger-btn ${isMobileMenuOpen ? "is-open" : ""}`}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${isMobileMenuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div
          className="backdrop-blur-sm px-4 py-4"
          style={{
            borderTop: "1px solid var(--ui-border)",
            backgroundColor: "color-mix(in srgb, var(--ui-surface) 94%, transparent)",
          }}
        >
          <div
            className="mb-4 rounded-xl p-3"
            style={{
              border: "1px solid var(--ui-border)",
              backgroundColor: "var(--ui-surface-muted)",
            }}
          >
            <div className="text-sm font-semibold truncate" style={{ color: "var(--ui-text)" }}>{user?.name}</div>
            <div className="text-xs capitalize mt-1" style={{ color: "var(--ui-text-soft)" }}>{user?.role?.replace("_", " ")}</div>
          </div>

          <nav className="grid grid-cols-1 gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-white shadow-sm"
                    : "hover:bg-gray-100"
                }`}
                style={
                  isActive(item.href)
                    ? { backgroundColor: "var(--accent-500)" }
                    : {
                        color: "var(--ui-text-muted)",
                        backgroundColor: "var(--ui-surface-muted)",
                      }
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full mt-3 rounded-xl justify-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="ml-2">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
