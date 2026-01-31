import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const KitchenDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchKitchenOrders();

    // Setup socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    newSocket.emit('join_kitchen');

    newSocket.on('new_verified_order', () => {
      fetchKitchenOrders();
      toast.info('New order received!', {
        position: 'top-center',
        autoClose: 3000,
      });
    });

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchKitchenOrders, 30000);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      clearInterval(interval);
    };
  }, []);

  const fetchKitchenOrders = async () => {
    try {
      const { data } = await api.get('/kitchen/orders');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/kitchen/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated!');
      fetchKitchenOrders();

      // Emit socket event
      if (socket) {
        socket.emit('order_status_updated', orderId);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      verified: 'bg-blue-100 border-blue-500',
      preparing: 'bg-yellow-100 border-yellow-500',
      ready: 'bg-green-100 border-green-500',
    };
    return colors[status] || 'bg-gray-100 border-gray-500';
  };

  const getStatusText = (status) => {
    const texts = {
      verified: 'NEW ORDER',
      preparing: 'PREPARING',
      ready: 'READY',
    };
    return texts[status] || status.toUpperCase();
  };

  const getTimeElapsed = (createdAt) => {
    const minutes = Math.floor((new Date() - new Date(createdAt)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    return `${minutes} mins ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Kitchen Display</h1>
          <div className="text-white text-xl">
            <span className="bg-blue-600 px-4 py-2 rounded">
              {orders.length} Active Orders
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-700">All Clear!</h2>
            <p className="text-gray-600 mt-2">No pending orders</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`bg-white rounded-lg border-l-8 ${getStatusColor(order.status)} p-6 shadow-lg`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      #{order.orderId.slice(-3)}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {getTimeElapsed(order.createdAt)}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                    order.status === 'verified' ? 'bg-blue-600 text-white' :
                    order.status === 'preparing' ? 'bg-yellow-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="mb-4 pb-4 border-b">
                  <p className="font-semibold text-gray-800">{order.studentName}</p>
                  <p className="text-sm text-gray-600">{order.studentPhone}</p>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-2">Items:</h3>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded"
                      >
                        <div>
                          <p className="font-semibold text-lg">{item.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-blue-600">
                            ×{item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div className="mb-4 bg-yellow-50 border border-yellow-300 rounded p-3">
                    <p className="font-bold text-yellow-800 text-sm mb-1">
                      ⚠️ Special Instructions:
                    </p>
                    <p className="text-sm text-yellow-700">{order.specialInstructions}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {order.status === 'verified' && (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'preparing')}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded transition"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'ready')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'completed')}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded transition"
                    >
                      Complete Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;
