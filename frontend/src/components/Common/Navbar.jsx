import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🍽️ College Canteen
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded ${
                    location.pathname === '/' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Order Food
                </Link>
                <Link
                  to="/track-order"
                  className={`px-4 py-2 rounded ${
                    location.pathname === '/track-order' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Track Order
                </Link>
                <Link
                  to="/login"
                  className="btn-primary"
                >
                  Staff Login
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-700">
                  Welcome, <strong>{user?.username}</strong> ({user?.role})
                </span>
                {user?.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === 'kitchen' && (
                  <Link
                    to="/kitchen"
                    className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Kitchen
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-danger"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
