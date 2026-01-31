import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/reports/summary');
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load statistics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="text-sm text-gray-600 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
          </div>

          <div className="card bg-yellow-50 border border-yellow-200">
            <h3 className="text-sm text-gray-600 mb-2">Pending Payments</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats?.pendingPayments || 0}</p>
          </div>

          <div className="card bg-purple-50 border border-purple-200">
            <h3 className="text-sm text-gray-600 mb-2">Active Orders</h3>
            <p className="text-3xl font-bold text-purple-600">{stats?.verifiedOrders || 0}</p>
          </div>

          <div className="card bg-green-50 border border-green-200">
            <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">₹{stats?.totalRevenue || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/dashboard/pending-verification" className="card hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="text-4xl mr-4">🔍</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Verify Payments</h3>
                <p className="text-gray-600">Review and verify pending payments</p>
                {stats?.pendingPayments > 0 && (
                  <span className="inline-block mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {stats.pendingPayments} pending
                  </span>
                )}
              </div>
            </div>
          </Link>

          <Link to="/dashboard/orders" className="card hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="text-4xl mr-4">📋</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Manage Orders</h3>
                <p className="text-gray-600">View and manage all orders</p>
              </div>
            </div>
          </Link>

          <Link to="/dashboard/menu" className="card hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="text-4xl mr-4">🍽️</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Menu Management</h3>
                <p className="text-gray-600">Add, edit, or remove menu items</p>
              </div>
            </div>
          </Link>

          <Link to="/dashboard/reports" className="card hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="text-4xl mr-4">📊</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Reports</h3>
                <p className="text-gray-600">View sales and analytics</p>
              </div>
            </div>
          </Link>

          <Link to="/dashboard/settings" className="card hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="text-4xl mr-4">⚙️</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Settings</h3>
                <p className="text-gray-600">Configure UPI and canteen details</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
