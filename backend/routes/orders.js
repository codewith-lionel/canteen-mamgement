import express from 'express';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Settings from '../models/Settings.js';

const router = express.Router();

// Helper function to generate Order ID
const generateOrderId = async () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Find the last order of the day
  const lastOrder = await Order.findOne({
    orderId: new RegExp(`^ORD${dateStr}`)
  }).sort({ orderId: -1 });

  let sequentialNumber = 1;
  if (lastOrder) {
    const lastSeq = parseInt(lastOrder.orderId.slice(-3));
    sequentialNumber = lastSeq + 1;
  }

  return `ORD${dateStr}${sequentialNumber.toString().padStart(3, '0')}`;
};

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { studentName, studentPhone, items, specialInstructions } = req.body;

    // Validate input
    if (!studentName || !studentPhone || !items || items.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Verify all items exist and are available
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItemId}` });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `${menuItem.name} is currently unavailable` });
      }

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      });

      totalAmount += menuItem.price * item.quantity;
    }

    // Get UPI settings
    const settings = await Settings.findOne();
    const upiId = settings ? settings.upiId : 'canteen@oksbi';

    // Generate order ID
    const orderId = await generateOrderId();

    // Create order
    const order = await Order.create({
      orderId,
      studentName,
      studentPhone,
      items: orderItems,
      totalAmount,
      specialInstructions: specialInstructions || '',
      status: 'pending_payment',
      paymentDetails: {
        upiId,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:orderId
// @desc    Get order by order ID
// @access  Public
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:orderId/submit-payment
// @desc    Submit payment confirmation
// @access  Public
router.put('/:orderId/submit-payment', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending_payment') {
      return res.status(400).json({ message: 'Order payment already submitted or processed' });
    }

    order.status = 'payment_submitted';
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/phone/:phone
// @desc    Get orders by phone number
// @access  Public
router.get('/phone/:phone', async (req, res) => {
  try {
    const orders = await Order.find({ studentPhone: req.params.phone })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
