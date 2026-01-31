# Smart College Canteen Management System

A complete MERN stack (MongoDB, Express.js, React.js, Node.js) application for managing college canteen operations with UPI payment integration.

## 🌟 Features

### Student Interface
- **Menu Browsing**: Browse categorized food items with images and prices
- **Shopping Cart**: Add/remove items, update quantities
- **Order Placement**: Enter details and place orders
- **UPI Payment**: Display QR code for payment without gateway integration
- **Order Tracking**: Real-time order status tracking

### Admin Dashboard
- **Payment Verification**: Manual verification of UPI payments
- **Order Management**: View and manage all orders
- **Menu Management**: Add, edit, delete menu items
- **Reports & Analytics**: Daily sales, revenue, popular items
- **Settings**: Configure UPI details and canteen information

### Kitchen Display
- **Real-time Order Queue**: View verified orders
- **Status Updates**: Update order preparation status
- **Order Completion**: Mark orders as ready or completed

## 🛠️ Technology Stack

### Backend
- Node.js (v18+)
- Express.js (v4.18+)
- MongoDB with Mongoose
- Socket.io for real-time updates
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React.js (v18+) with Vite
- React Router DOM (v6+)
- Axios for API calls
- Socket.io-client for real-time updates
- Tailwind CSS for styling
- QRCode.react for QR code generation
- React-Toastify for notifications

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/codewith-lionel/canteen-mamgement.git
cd canteen-mamgement
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already exists, but update if needed)
# The .env file should contain:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/canteen-management
# JWT_SECRET=your_jwt_secret_key_change_in_production
# NODE_ENV=development
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (already exists)
# The .env file should contain:
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
```

### 4. Setup Database

Make sure MongoDB is running on your system. Then seed the database with sample data:

```bash
cd ../backend
npm run seed
```

This will create:
- Default admin user (username: `admin`, password: `admin123`)
- Default kitchen user (username: `kitchen`, password: `kitchen123`)
- Sample menu items (breakfast, lunch, snacks, beverages)
- Default UPI settings

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Application

```bash
cd frontend
npm run dev
```

The frontend application will run on `http://localhost:5173`

## 🔐 Default Credentials

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full dashboard access, payment verification, reports

### Kitchen Login
- **Username**: `kitchen`
- **Password**: `kitchen123`
- **Access**: Kitchen display only

### Student Access
- No login required for browsing menu and placing orders
- Can track orders using Order ID

## 📱 User Workflows

### Student Order Flow
1. Visit homepage to browse menu
2. Add items to cart
3. Proceed to checkout
4. Enter name, phone number, and special instructions
5. Click "Place Order"
6. View UPI QR code and payment details
7. Complete payment using any UPI app
8. Click "I have completed the payment"
9. Track order status using Order ID

### Admin Payment Verification Flow
1. Login to admin dashboard
2. Click "Verify Payments" from dashboard
3. View list of pending payment verifications
4. Check UPI app for payment notification
5. Verify amount and payer name match
6. Click "Approve Payment" or "Reject Payment"
7. Approved orders appear in kitchen display

### Kitchen Order Flow
1. Login with kitchen credentials
2. View real-time order queue
3. Click "Start Preparing" when beginning order
4. Click "Mark as Ready" when order is complete
5. Click "Complete Order" after student pickup

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order by ID
- `PUT /api/orders/:orderId/submit-payment` - Submit payment
- `GET /api/orders/phone/:phone` - Get orders by phone

### Admin
- `GET /api/admin/orders` - Get all orders with filters
- `GET /api/admin/orders/pending-verification` - Get pending payments
- `PUT /api/admin/orders/:orderId/verify-payment` - Verify/reject payment
- `PUT /api/admin/orders/:orderId/status` - Update order status
- `GET /api/admin/reports/daily` - Get daily report
- `GET /api/admin/reports/summary` - Get summary statistics

### Kitchen
- `GET /api/kitchen/orders` - Get active kitchen orders
- `PUT /api/kitchen/orders/:orderId/status` - Update order status

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings (Admin)

## 🔧 Configuration

### Update UPI Settings
1. Login as admin
2. Navigate to Dashboard → Settings
3. Update Canteen Name, UPI ID, and Contact Phone
4. Upload custom QR code or let system generate one
5. Click "Save Settings"

### Add Menu Items
1. Login as admin
2. Navigate to Dashboard → Menu Management
3. Click "Add Menu Item"
4. Fill in details (name, category, description, price, image URL)
5. Set availability status
6. Click "Add Item"

## 🎨 Customization

### Change Theme Colors
Edit `frontend/src/index.css` to customize the color scheme:
```css
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition;
}
```

### Modify Categories
Update menu categories in:
- `backend/models/MenuItem.js` - Schema definition
- `frontend/src/components/Student/Menu.jsx` - Category filter

## 📊 Reports & Analytics

The admin dashboard provides:
- **Daily Sales Summary**: Total orders, revenue, average order value
- **Popular Items**: Most ordered items with quantities
- **Order History**: Complete order list with export to CSV
- **Real-time Statistics**: Pending payments, active orders, total revenue

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes for admin and kitchen
- Input validation and sanitization
- Rate limiting (can be added)
- CORS enabled

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `sudo systemctl start mongod`
- Check connection string in `backend/.env`

### Port Already in Use
- Change port in `backend/.env` (backend)
- Change port in `frontend/vite.config.js` (frontend)

### Socket.io Connection Issues
- Check SOCKET_URL in `frontend/.env`
- Ensure backend server is running

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributors

- Lionel (codewith-lionel)

## 🙏 Acknowledgments

- React.js and Vite for frontend framework
- Express.js for backend framework
- MongoDB for database
- Socket.io for real-time features
- Tailwind CSS for styling

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This system uses manual UPI payment verification by admin. No payment gateway integration is included. Students make payments directly to the canteen's UPI ID, and admins verify payments by checking their UPI app notifications.