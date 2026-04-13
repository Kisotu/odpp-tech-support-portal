import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user?.name}</span>
              <span className="mx-2">|</span>
              <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">New Tickets</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">0</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">In Progress</div>
              <div className="text-3xl font-bold text-yellow-600 mt-2">0</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">Resolved</div>
              <div className="text-3xl font-bold text-green-600 mt-2">0</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">Closed</div>
              <div className="text-3xl font-bold text-gray-600 mt-2">0</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to ODPP Tech Support Portal</h2>
            <p className="text-gray-600">
              {user?.role === 'staff' 
                ? 'Submit and track your IT support requests from this portal.'
                : 'Manage and resolve IT support tickets efficiently.'}
            </p>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Phase 1 Complete!</strong> Authentication system is working. 
                Next phases will add ticket management, dashboards, and reporting features.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
