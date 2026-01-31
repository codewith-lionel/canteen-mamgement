import express from 'express';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/admin/orders
// @desc    Get all orders with filters
// @access  Private/Admin
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/orders/pending-verification
// @desc    Get orders pending payment verification
// @access  Private/Admin
router.get('/orders/pending-verification', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'payment_submitted' })
      .sort({ createdAt: 1 }); // Oldest first

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/orders/:orderId/verify-payment
// @desc    Verify or reject payment
// @access  Private/Admin
router.put('/orders/:orderId/verify-payment', protect, adminOnly, async (req, res) => {
  try {
    const { action, rejectionReason } = req.body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'payment_submitted') {
      return res.status(400).json({ message: 'Order is not pending verification' });
    }

    if (action === 'approve') {
      order.status = 'verified';
      order.paymentDetails.verifiedBy = req.user.username;
      order.paymentDetails.verificationTime = new Date();
    } else if (action === 'reject') {
      order.status = 'rejected';
      order.paymentDetails.rejectionReason = rejectionReason || 'Payment not verified';
      order.paymentDetails.verifiedBy = req.user.username;
      order.paymentDetails.verificationTime = new Date();
    }

    const updatedOrder = await order.save();

    // Emit socket events
    const io = req.app.get('io');
    if (io) {
      // Notify kitchen if approved
      if (action === 'approve') {
        io.to('kitchen').emit('new_verified_order', updatedOrder);
      }
      // Notify the specific order room
      io.to(`order_${order.orderId}`).emit('order_updated', updatedOrder);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/orders/:orderId/status
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:orderId/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['verified', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/reports/daily
// @desc    Get daily sales report
// @access  Private/Admin
router.get('/reports/daily', protect, adminOnly, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    // Set date range for the day
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['verified', 'preparing', 'ready', 'completed'] }
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate popular items
    const itemStats = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = { quantity: 0, revenue: 0 };
        }
        itemStats[item.name].quantity += item.quantity;
        itemStats[item.name].revenue += item.price * item.quantity;
      });
    });

    const popularItems = Object.entries(itemStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalOrders,
      totalRevenue,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      popularItems,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/reports/summary
// @desc    Get summary statistics
// @access  Private/Admin
router.get('/reports/summary', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingPayments = await Order.countDocuments({ status: 'payment_submitted' });
    const verifiedOrders = await Order.countDocuments({ status: { $in: ['verified', 'preparing', 'ready'] } });
    const completedOrders = await Order.countDocuments({ status: 'completed' });

    const completedOrdersData = await Order.find({ status: 'completed' });
    const totalRevenue = completedOrdersData.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      totalOrders,
      pendingPayments,
      verifiedOrders,
      completedOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
