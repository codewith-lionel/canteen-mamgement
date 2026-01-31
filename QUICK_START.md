# Quick Start Guide

Get the Smart College Canteen Management System up and running in 5 minutes!

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js (v18 or higher) - [Download](https://nodejs.org/)
- ✅ MongoDB (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- ✅ A code editor (VS Code recommended)
- ✅ A terminal/command prompt

## Quick Installation

### Option 1: Automated Setup (Recommended)

**On Linux/Mac:**
```bash
./setup.sh
```

**On Windows:**
```bash
setup.bat
```

This will:
- Install all dependencies
- Seed the database with sample data
- Set up default admin and kitchen users

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend (in new terminal)
   cd frontend
   npm install
   ```

2. **Seed Database**
   ```bash
   cd backend
   npm run seed
   ```

## Starting the Application

You need TWO terminal windows:

### Terminal 1: Backend Server
```bash
cd backend
npm start
```
✅ Server running at: http://localhost:5000

### Terminal 2: Frontend App
```bash
cd frontend
npm run dev
```
✅ App running at: http://localhost:5173

## First Steps

### 1. Access the Application
Open your browser and go to: **http://localhost:5173**

### 2. Try the Student Flow
- Browse the menu (16 sample items loaded)
- Add items to cart
- Go to checkout
- Enter your details:
  - Name: Your Name
  - Phone: 1234567890
- Place order
- You'll see a UPI QR code (demo mode)
- Click "I have completed the payment"
- Track your order

### 3. Login as Admin
- Click "Staff Login" in navigation
- Username: `admin`
- Password: `admin123`
- You'll see the admin dashboard
- Go to "Verify Payments"
- Approve the payment you just submitted
- Check reports and analytics

### 4. Login as Kitchen Staff
- Logout from admin
- Login again with:
  - Username: `kitchen`
  - Password: `kitchen123`
- See the kitchen display with verified orders
- Update order status (Preparing → Ready → Completed)

## Common Issues & Solutions

### MongoDB Not Running
```bash
# Start MongoDB
# On Linux/Mac:
sudo systemctl start mongod

# On Windows:
net start MongoDB
```

### Port Already in Use
If port 5000 or 5173 is busy:

**Backend:** Change in `backend/.env`
```
PORT=5001
```

**Frontend:** Change in `frontend/vite.config.js`
```javascript
server: { port: 5174 }
```

### Dependencies Installation Failed
Try clearing npm cache:
```bash
npm cache clean --force
npm install
```

### Database Seed Failed
Make sure MongoDB is running, then:
```bash
cd backend
npm run seed
```

## What's Next?

### Customize Your Canteen
1. **Update UPI Details**
   - Login as admin
   - Go to Settings
   - Update UPI ID and Canteen Name
   - Upload your QR code

2. **Manage Menu**
   - Go to Menu Management
   - Add your actual food items
   - Set prices and availability
   - Upload food images

3. **Start Taking Orders**
   - Share the URL with students
   - Monitor orders in real-time
   - Verify payments manually
   - Kitchen prepares orders

## Testing the Complete Flow

Here's a complete test scenario:

1. **As Student:**
   - Order 2 Idli Sambar + 1 Tea (₹90)
   - Note your Order ID (e.g., ORD20260131001)

2. **As Admin:**
   - See notification of new payment
   - Verify and approve payment
   - (In real scenario, check UPI app)

3. **As Kitchen:**
   - See order in queue
   - Start preparing
   - Mark as ready

4. **As Student:**
   - Track order status
   - Receive "Order Ready" notification
   - Collect from canteen

## Development Mode

For development with auto-reload:

```bash
# Backend (auto-restarts on file changes)
cd backend
npm run dev

# Frontend (hot module replacement)
cd frontend
npm run dev
```

## Production Deployment

For production:

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set Environment:**
   ```bash
   # In backend/.env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   ```

3. **Use Process Manager:**
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name canteen-backend
   ```

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🔧 Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- 🤝 See [CONTRIBUTING.md](CONTRIBUTING.md)
- 🐛 Report issues on GitHub

## Quick Reference

### Default Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Kitchen | kitchen | kitchen123 |

### URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API Docs | http://localhost:5000/api |

### Order Status Flow
```
Pending Payment → Payment Submitted → Verified → Preparing → Ready → Completed
```

---

**🎉 Congratulations!** You're ready to manage your canteen digitally!

For detailed information, refer to the complete [README.md](README.md).
