import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ICTDashboard from "./pages/ICTDashboard";
import Tickets from "./pages/Tickets";
import TicketView from "./pages/TicketView";
import CreateTicket from "./pages/CreateTicket";
import Reports from "./pages/Reports";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseView from "./pages/KnowledgeBaseView";
import KnowledgeBaseEditor from "./pages/KnowledgeBaseEditor";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Toast from "./components/common/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ children, allowedRoles }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function HomeRedirect() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === "ict_officer" || user?.role === "admin") {
    return <Navigate to="/ict-dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toast />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ict-dashboard"
              element={
                <RoleRoute allowedRoles={["ict_officer", "admin"]}>
                  <ICTDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <Tickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets/create"
              element={
                <ProtectedRoute>
                  <CreateTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets/:id"
              element={
                <ProtectedRoute>
                  <TicketView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <RoleRoute allowedRoles={["ict_officer", "admin"]}>
                  <Reports />
                </RoleRoute>
              }
            />
            <Route
              path="/knowledge-base"
              element={
                <ProtectedRoute>
                  <KnowledgeBase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/knowledge-base/new"
              element={
                <RoleRoute allowedRoles={["ict_officer", "admin"]}>
                  <KnowledgeBaseEditor />
                </RoleRoute>
              }
            />
            <Route
              path="/knowledge-base/:id"
              element={
                <ProtectedRoute>
                  <KnowledgeBaseView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/knowledge-base/:id/edit"
              element={
                <RoleRoute allowedRoles={["ict_officer", "admin"]}>
                  <KnowledgeBaseEditor />
                </RoleRoute>
              }
            />
            <Route path="/" element={<HomeRedirect />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
