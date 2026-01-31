import express from 'express';
import Settings from '../models/Settings.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get settings (public can see UPI details for payment)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        canteenName: 'College Canteen',
        upiId: 'canteen@oksbi',
        upiQrCode: '',
        contactPhone: '',
      });
    }

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/settings
// @desc    Update settings
// @access  Private/Admin
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const { canteenName, upiId, upiQrCode, contactPhone } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        canteenName,
        upiId,
        upiQrCode,
        contactPhone,
      });
    } else {
      settings.canteenName = canteenName || settings.canteenName;
      settings.upiId = upiId || settings.upiId;
      settings.upiQrCode = upiQrCode !== undefined ? upiQrCode : settings.upiQrCode;
      settings.contactPhone = contactPhone !== undefined ? contactPhone : settings.contactPhone;
      
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
