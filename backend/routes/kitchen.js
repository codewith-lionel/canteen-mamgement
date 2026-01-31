import express from 'express';
import Order from '../models/Order.js';
import { protect, kitchenOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/kitchen/orders
// @desc    Get verified orders for kitchen
// @access  Private/Kitchen
router.get('/orders', protect, kitchenOrAdmin, async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ['verified', 'preparing', 'ready'] }
    }).sort({ createdAt: 1 }); // Oldest first

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/kitchen/orders/:orderId/status
// @desc    Update order status (kitchen workflow)
// @access  Private/Kitchen
router.put('/orders/:orderId/status', protect, kitchenOrAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['preparing', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order.orderId}`).emit('order_updated', updatedOrder);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
