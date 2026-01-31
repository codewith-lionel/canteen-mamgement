import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  studentPhone: {
    type: String,
    required: true,
    trim: true,
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  specialInstructions: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending_payment', 'payment_submitted', 'verified', 'rejected', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending_payment',
  },
  paymentDetails: {
    upiId: {
      type: String,
      default: '',
    },
    paymentProof: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: String,
      default: '',
    },
    verificationTime: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
