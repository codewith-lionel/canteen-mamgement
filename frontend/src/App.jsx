import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Login from './components/Common/Login';

// Student Components
import Menu from './components/Student/Menu';
import Checkout from './components/Student/Checkout';
import PaymentScreen from './components/Student/PaymentScreen';
import OrderTracking from './components/Student/OrderTracking';

// Admin Components
import Dashboard from './components/Admin/Dashboard';
import PendingVerification from './components/Admin/PendingVerification';
import OrderManagement from './components/Admin/OrderManagement';
import MenuManagement from './components/Admin/MenuManagement';
import Reports from './components/Admin/Reports';
import Settings from './components/Admin/Settings';

// Kitchen Components
import KitchenDisplay from './components/Kitchen/KitchenDisplay';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/:orderId" element={<PaymentScreen />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/track-order/:orderId" element={<OrderTracking />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/pending-verification"
              element={
                <ProtectedRoute role="admin">
                  <PendingVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders"
              element={
                <ProtectedRoute role="admin">
                  <OrderManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/menu"
              element={
                <ProtectedRoute role="admin">
                  <MenuManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/reports"
              element={
                <ProtectedRoute role="admin">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute role="admin">
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Kitchen Routes */}
            <Route
              path="/kitchen"
              element={
                <ProtectedRoute role="kitchen">
                  <KitchenDisplay />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
