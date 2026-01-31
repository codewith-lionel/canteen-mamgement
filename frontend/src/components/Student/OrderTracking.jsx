import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const OrderTracking = () => {
  const { orderId: paramOrderId } = useParams();
  const [orderId, setOrderId] = useState(paramOrderId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (paramOrderId) {
      fetchOrder(paramOrderId);
    }

    // Setup socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [paramOrderId]);

  useEffect(() => {
    if (socket && order) {
      socket.emit('join_order', order.orderId);

      socket.on('order_updated', (updatedOrder) => {
        if (updatedOrder.orderId === order.orderId) {
          setOrder(updatedOrder);
          toast.info(`Order status updated: ${getStatusText(updatedOrder.status)}`);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('order_updated');
      }
    };
  }, [socket, order]);

  const fetchOrder = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
      setOrderId(id);
    } catch (error) {
      console.error(error);
      toast.error('Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      fetchOrder(orderId.trim());
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending_payment: 'Pending Payment',
      payment_submitted: 'Payment Submitted - Awaiting Verification',
      verified: 'Payment Verified',
      rejected: 'Payment Rejected',
      preparing: 'Order Being Prepared',
      ready: 'Order Ready for Pickup',
      completed: 'Order Completed',
      cancelled: 'Order Cancelled',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending_payment: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      payment_submitted: 'bg-blue-100 text-blue-800 border-blue-300',
      verified: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      preparing: 'bg-purple-100 text-purple-800 border-purple-300',
      ready: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const renderStatusTimeline = () => {
    const statuses = [
      { key: 'pending_payment', label: 'Order Placed' },
      { key: 'payment_submitted', label: 'Payment Submitted' },
      { key: 'verified', label: 'Payment Verified' },
      { key: 'preparing', label: 'Preparing' },
      { key: 'ready', label: 'Ready' },
      { key: 'completed', label: 'Completed' },
    ];

    const currentIndex = statuses.findIndex(s => s.key === order.status);

    return (
      <div className="relative">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={status.key} className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <div className="ml-4">
                <p className={`font-medium ${isCurrent ? 'text-green-600' : ''}`}>
                  {status.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Track Your Order</h1>

        {/* Order ID Input */}
        <div className="card mb-8">
          <form onSubmit={handleTrack} className="flex gap-4">
            <input
              type="text"
              className="input flex-1"
              placeholder="Enter your Order ID (e.g., ORD20260131001)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Information */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-bold">{order.orderId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium">{order.studentName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{order.studentPhone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className={`inline-block px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                {order.status === 'rejected' && order.paymentDetails?.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-sm font-semibold text-red-800 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{order.paymentDetails.rejectionReason}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Order Time</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {order.specialInstructions && (
                  <div>
                    <p className="text-sm text-gray-600">Special Instructions</p>
                    <p className="font-medium">{order.specialInstructions}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <h3 className="font-bold mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Order Progress</h2>
              
              {order.status !== 'rejected' && order.status !== 'cancelled' ? (
                renderStatusTimeline()
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">❌</div>
                  <p className="text-xl font-bold text-red-600">
                    {order.status === 'rejected' ? 'Payment Rejected' : 'Order Cancelled'}
                  </p>
                </div>
              )}

              {order.status === 'ready' && (
                <div className="mt-6 bg-green-50 border border-green-300 rounded p-4">
                  <p className="text-green-800 font-bold text-center">
                    🎉 Your order is ready! Please collect from the canteen.
                  </p>
                </div>
              )}

              {order.status === 'completed' && (
                <div className="mt-6 bg-blue-50 border border-blue-300 rounded p-4">
                  <p className="text-blue-800 font-bold text-center">
                    ✅ Order completed. Thank you!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
