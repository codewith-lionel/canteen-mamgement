import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Reports = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyReport();
  }, [selectedDate]);

  const fetchDailyReport = async () => {
    try {
      const { data } = await api.get('/admin/reports/daily', {
        params: { date: selectedDate },
      });
      setDailyReport(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load report');
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!dailyReport || !dailyReport.orders) return;

    const headers = ['Order ID', 'Customer', 'Phone', 'Items', 'Amount', 'Status', 'Time'];
    const rows = dailyReport.orders.map(order => [
      order.orderId,
      order.studentName,
      order.studentPhone,
      order.items.map(item => `${item.name} x${item.quantity}`).join('; '),
      order.totalAmount,
      order.status,
      new Date(order.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canteen-report-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <button onClick={exportToCSV} className="btn-primary">
            📥 Export to CSV
          </button>
        </div>

        {/* Date Selector */}
        <div className="card mb-8">
          <label className="label">Select Date</label>
          <input
            type="date"
            className="input max-w-xs"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="text-sm text-gray-600 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{dailyReport?.totalOrders || 0}</p>
          </div>

          <div className="card bg-green-50 border border-green-200">
            <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">₹{dailyReport?.totalRevenue || 0}</p>
          </div>

          <div className="card bg-purple-50 border border-purple-200">
            <h3 className="text-sm text-gray-600 mb-2">Avg Order Value</h3>
            <p className="text-3xl font-bold text-purple-600">₹{dailyReport?.avgOrderValue || 0}</p>
          </div>
        </div>

        {/* Popular Items */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Items</h2>
          {dailyReport?.popularItems?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Rank</th>
                    <th className="text-left py-2 px-4">Item Name</th>
                    <th className="text-left py-2 px-4">Quantity Sold</th>
                    <th className="text-left py-2 px-4">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyReport.popularItems.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-bold">{index + 1}</td>
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4 font-semibold">₹{item.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No data available for this date</p>
          )}
        </div>

        {/* Orders List */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">All Orders</h2>
          {dailyReport?.orders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Order ID</th>
                    <th className="text-left py-2 px-4">Customer</th>
                    <th className="text-left py-2 px-4">Items</th>
                    <th className="text-left py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyReport.orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-semibold">{order.orderId}</td>
                      <td className="py-2 px-4">
                        <div>
                          <p className="font-medium">{order.studentName}</p>
                          <p className="text-sm text-gray-600">{order.studentPhone}</p>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {order.items.map(item => `${item.name} ×${item.quantity}`).join(', ')}
                      </td>
                      <td className="py-2 px-4 font-semibold">₹{order.totalAmount}</td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 rounded text-xs bg-gray-100">
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No orders for this date</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
