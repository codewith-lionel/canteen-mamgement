import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        studentName,
        studentPhone,
        items: cart.map(item => ({
          menuItemId: item._id,
          quantity: item.quantity,
        })),
        specialInstructions,
      };

      const { data } = await api.post('/orders', orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Navigate to payment screen
      navigate(`/payment/${data.orderId}`);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{getTotalAmount()}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Your Details</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="label">Name *</label>
                <input
                  type="text"
                  className="input"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This name should match your UPI account name
                </p>
              </div>

              <div>
                <label className="label">Phone Number *</label>
                <input
                  type="tel"
                  className="input"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label className="label">Special Instructions (Optional)</label>
                <textarea
                  className="input"
                  rows="3"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., Extra spicy, No onions, etc."
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Important:</strong> After placing the order, you will be shown a UPI QR code. 
                  Please complete the payment and then click "I have completed the payment" button.
                </p>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 text-lg"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
