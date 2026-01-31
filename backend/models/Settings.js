import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  canteenName: {
    type: String,
    required: true,
    default: 'College Canteen',
  },
  upiId: {
    type: String,
    required: true,
    default: 'canteen@oksbi',
  },
  upiQrCode: {
    type: String,
    default: '',
  },
  contactPhone: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
settingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
