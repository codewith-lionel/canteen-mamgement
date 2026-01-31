import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Settings from '../models/Settings.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await MenuItem.deleteMany();
    await Settings.deleteMany();

    console.log('Cleared existing data');

    // Create default admin and kitchen users
    const admin = await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    });

    const kitchen = await User.create({
      username: 'kitchen',
      password: 'kitchen123',
      role: 'kitchen',
    });

    console.log('Created users');

    // Create sample menu items
    const menuItems = [
      // Breakfast
      {
        name: 'Idli Sambar',
        category: 'Breakfast',
        description: 'Steamed rice cakes with sambar and chutney',
        price: 40,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
        isAvailable: true,
      },
      {
        name: 'Masala Dosa',
        category: 'Breakfast',
        description: 'Crispy rice crepe filled with spiced potato',
        price: 50,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400',
        isAvailable: true,
      },
      {
        name: 'Poha',
        category: 'Breakfast',
        description: 'Flattened rice with vegetables and spices',
        price: 30,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        isAvailable: true,
      },
      {
        name: 'Upma',
        category: 'Breakfast',
        description: 'Semolina porridge with vegetables',
        price: 35,
        image: 'https://images.unsplash.com/photo-1589301773859-51d17b681ead?w=400',
        isAvailable: true,
      },
      // Lunch
      {
        name: 'Veg Thali',
        category: 'Lunch',
        description: 'Complete meal with rice, dal, vegetables, roti, and dessert',
        price: 80,
        image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400',
        isAvailable: true,
      },
      {
        name: 'Chole Bhature',
        category: 'Lunch',
        description: 'Spicy chickpeas with fried bread',
        price: 70,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400',
        isAvailable: true,
      },
      {
        name: 'Paneer Butter Masala with Rice',
        category: 'Lunch',
        description: 'Cottage cheese in creamy tomato gravy with rice',
        price: 90,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
        isAvailable: true,
      },
      {
        name: 'Biryani',
        category: 'Lunch',
        description: 'Fragrant rice with vegetables and spices',
        price: 100,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
        isAvailable: true,
      },
      // Snacks
      {
        name: 'Samosa',
        category: 'Snacks',
        description: 'Fried pastry with spiced potato filling (2 pieces)',
        price: 20,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        isAvailable: true,
      },
      {
        name: 'Vada Pav',
        category: 'Snacks',
        description: 'Spicy potato fritter in a bun',
        price: 25,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        isAvailable: true,
      },
      {
        name: 'Pav Bhaji',
        category: 'Snacks',
        description: 'Spiced vegetable mash with buttered bread',
        price: 60,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        isAvailable: true,
      },
      {
        name: 'Sandwich',
        category: 'Snacks',
        description: 'Grilled vegetable sandwich',
        price: 40,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
        isAvailable: true,
      },
      // Beverages
      {
        name: 'Tea',
        category: 'Beverages',
        description: 'Hot masala tea',
        price: 10,
        image: 'https://images.unsplash.com/photo-1597318113393-862d96b7c13e?w=400',
        isAvailable: true,
      },
      {
        name: 'Coffee',
        category: 'Beverages',
        description: 'Hot filter coffee',
        price: 15,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
        isAvailable: true,
      },
      {
        name: 'Cold Coffee',
        category: 'Beverages',
        description: 'Chilled coffee with milk',
        price: 30,
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
        isAvailable: true,
      },
      {
        name: 'Fresh Juice',
        category: 'Beverages',
        description: 'Seasonal fruit juice',
        price: 35,
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
        isAvailable: true,
      },
    ];

    await MenuItem.insertMany(menuItems);
    console.log('Created menu items');

    // Create default settings
    await Settings.create({
      canteenName: 'College Canteen',
      upiId: 'canteen@oksbi',
      upiQrCode: '',
      contactPhone: '1234567890',
    });

    console.log('Created default settings');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDefault credentials:');
    console.log('Admin - Username: admin, Password: admin123');
    console.log('Kitchen - Username: kitchen, Password: kitchen123');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
