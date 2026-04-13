import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Button from "./Button";

export default function Navigation() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

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
      ];
    }

    return baseNav;
  };

  const navigation = getNavigation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Nav Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-odpp-blue rounded-lg flex items-center justify-center">
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
                <span className="text-lg font-bold text-gray-900">
                  ODPP Support
                </span>
              </Link>
            </div>
            <nav className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-odpp-blue text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user?.role?.replace("_", " ")}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
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
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden border-t border-gray-200">
        <nav className="flex justify-around py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex-1 text-center py-2 text-sm font-medium ${
                isActive(item.href)
                  ? "text-odpp-blue border-b-2 border-odpp-blue"
                  : "text-gray-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
