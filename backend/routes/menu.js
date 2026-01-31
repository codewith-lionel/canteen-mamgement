import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items (available items for students, all for admin)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    // For public access, only show available items
    if (available === 'true') {
      filter.isAvailable = true;
    }

    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/menu
// @desc    Create menu item
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, description, price, image, isAvailable } = req.body;

    // Validate input
    if (!name || !category || !description || price === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const menuItem = await MenuItem.create({
      name,
      category,
      description,
      price,
      image: image || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, description, price, image, isAvailable } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    menuItem.name = name || menuItem.name;
    menuItem.category = category || menuItem.category;
    menuItem.description = description || menuItem.description;
    menuItem.price = price !== undefined ? price : menuItem.price;
    menuItem.image = image !== undefined ? image : menuItem.image;
    menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await menuItem.deleteOne();
    res.json({ message: 'Menu item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
