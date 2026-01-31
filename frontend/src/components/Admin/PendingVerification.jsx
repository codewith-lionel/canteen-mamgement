import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const PendingVerification = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchPendingOrders();

    // Setup socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    newSocket.emit('join_admin');

    newSocket.on('new_payment_submitted', () => {
      fetchPendingOrders();
      toast.info('New payment submitted!');
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders/pending-verification');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load pending orders');
      setLoading(false);
    }
  };

  const handleVerify = async (orderId, action, rejectionReason = '') => {
    try {
      await api.put(`/admin/orders/${orderId}/verify-payment`, {
        action,
        rejectionReason,
      });

      toast.success(`Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      fetchPendingOrders();

      // Emit socket event
      if (socket) {
        socket.emit('payment_verified', orderId);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to verify payment');
    }
  };

  const handleApprove = (orderId) => {
    if (window.confirm('Have you verified the payment in your UPI app?')) {
      handleVerify(orderId, 'approve');
    }
  };

  const handleReject = (orderId) => {
    const reason = window.prompt('Enter rejection reason (optional):');
    if (reason !== null) {
      handleVerify(orderId, 'reject', reason || 'Payment not verified');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading pending verifications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Pending Payment Verification
        </h1>

        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-700">All Clear!</h2>
            <p className="text-gray-600 mt-2">No pending payments to verify</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="card border-l-4 border-yellow-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Details */}
                  <div className="lg:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Submitted: {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Customer Name</p>
                        <p className="font-semibold">{order.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-semibold">{order.studentPhone}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Items Ordered:</p>
                      <div className="bg-gray-50 rounded p-3 space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span className="font-semibold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.specialInstructions && (
                      <div>
                        <p className="text-sm text-gray-600">Special Instructions:</p>
                        <p className="text-sm font-medium bg-yellow-50 p-2 rounded">
                          {order.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Verification Instructions */}
                  <div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-blue-800 mb-2">Verification Steps:</h4>
                      <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                        <li>Open your UPI app</li>
                        <li>Check for payment notification</li>
                        <li>Verify amount: ₹{order.totalAmount}</li>
                        <li>Check payer name matches: {order.studentName}</li>
                        <li>Click Approve or Reject below</li>
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleApprove(order.orderId)}
                        className="w-full btn-success py-3 text-lg"
                      >
                        ✓ Approve Payment
                      </button>
                      <button
                        onClick={() => handleReject(order.orderId)}
                        className="w-full btn-danger py-3 text-lg"
                      >
                        ✕ Reject Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingVerification;
