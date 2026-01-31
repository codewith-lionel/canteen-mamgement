import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const PaymentScreen = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrderAndSettings();
  }, [orderId]);

  const fetchOrderAndSettings = async () => {
    try {
      const [orderRes, settingsRes] = await Promise.all([
        api.get(`/orders/${orderId}`),
        api.get('/settings'),
      ]);
      
      setOrder(orderRes.data);
      setSettings(settingsRes.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load payment details');
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    setSubmitting(true);
    try {
      await api.put(`/orders/${orderId}/submit-payment`);
      toast.success('Payment submitted! Awaiting verification.');
      navigate(`/track-order/${orderId}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading payment details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Generate UPI payment string
  const upiString = `upi://pay?pa=${settings?.upiId || 'canteen@oksbi'}&pn=${settings?.canteenName || 'College Canteen'}&am=${order.totalAmount}&cu=INR&tn=Order ${orderId}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Complete Your Payment
            </h1>
            <p className="text-gray-600">Order ID: <strong>{order.orderId}</strong></p>
          </div>

          {/* Order Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-blue-300 mt-4 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-green-800">
              Payment Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Scan the QR code below with any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
              <li>Verify the amount: ₹{order.totalAmount}</li>
              <li>Complete the payment</li>
              <li>Click "I have completed the payment" button below</li>
              <li>Wait for admin to verify your payment</li>
            </ol>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="inline-block p-6 bg-white border-4 border-blue-600 rounded-lg shadow-lg">
              {settings?.upiQrCode ? (
                <img 
                  src={settings.upiQrCode} 
                  alt="UPI QR Code" 
                  className="w-64 h-64 mx-auto"
                />
              ) : (
                <QRCodeSVG
                  value={upiString}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>
            <p className="mt-4 text-sm text-gray-600">Scan this QR code with your UPI app</p>
          </div>

          {/* UPI ID */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Or pay manually using UPI ID:</p>
            <p className="text-xl font-bold text-blue-600">{settings?.upiId || 'canteen@oksbi'}</p>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
            <p className="font-bold text-yellow-800 mb-2">⚠️ Important:</p>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Your payment will be verified by admin manually</li>
              <li>• Make sure the payer name matches: <strong>{order.studentName}</strong></li>
              <li>• Keep this page open until payment is completed</li>
              <li>• You can track your order status using Order ID: {order.orderId}</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            onClick={handlePaymentSubmit}
            disabled={submitting}
            className="w-full btn-success py-4 text-lg"
          >
            {submitting ? 'Submitting...' : '✓ I have completed the payment'}
          </button>

          {/* Track Order Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate(`/track-order/${orderId}`)}
              className="text-blue-600 hover:underline"
            >
              Track this order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
