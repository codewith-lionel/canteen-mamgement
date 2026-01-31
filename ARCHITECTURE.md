# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Student    │  │    Admin     │  │   Kitchen    │          │
│  │  Interface   │  │  Dashboard   │  │   Display    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                  │                   │
│         └─────────────────┴──────────────────┘                   │
│                           │                                       │
│                    React Frontend                                │
│                   (Port 5173 - Vite)                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                   HTTP/WebSocket
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                    API Gateway Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    Express.js Server                             │
│                     (Port 5000)                                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Middleware Layer                         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  • CORS          • JSON Parser    • Auth (JWT)           │  │
│  │  • Socket.io     • Error Handler  • Rate Limiting        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                    Business Logic Layer                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    Auth     │  │    Menu     │  │   Orders    │            │
│  │   Routes    │  │   Routes    │  │   Routes    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    Admin    │  │   Kitchen   │  │  Settings   │            │
│  │   Routes    │  │   Routes    │  │   Routes    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                      Data Access Layer                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    Mongoose ODM                                  │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   User   │  │ MenuItem │  │  Order   │  │ Settings │       │
│  │  Model   │  │  Model   │  │  Model   │  │  Model   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                      Database Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                      MongoDB                                     │
│                (localhost:27017)                                 │
│                                                                   │
│  Collections:                                                    │
│  • users           • menuitems                                   │
│  • orders          • settings                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Student Order Flow

```
Student → Menu Browse → Add to Cart → Checkout → Place Order
                                                      ↓
                                            Order Created (DB)
                                                      ↓
                                            UPI Payment Screen
                                                      ↓
                                         Student Pays & Confirms
                                                      ↓
                                      Status: payment_submitted
                                                      ↓
                                         Socket → Admin Notified
```

### 2. Payment Verification Flow

```
Admin Dashboard → Pending Verification View
        ↓
Check UPI App (External)
        ↓
Verify Amount & Name Match
        ↓
     Approve                          Reject
        ↓                               ↓
Status: verified           Status: rejected
        ↓                               ↓
Socket → Kitchen          Socket → Student
```

### 3. Kitchen Preparation Flow

```
Kitchen Display → View Verified Orders
        ↓
Start Preparing (Status: preparing)
        ↓
Complete Cooking (Status: ready)
        ↓
Student Pickup (Status: completed)
        ↓
Socket → Student (Real-time Updates)
```

## Component Architecture

### Frontend Components

```
App.jsx
├── AuthProvider (Context)
├── Router
│   ├── Public Routes
│   │   ├── / (Menu)
│   │   ├── /checkout (Checkout)
│   │   ├── /payment/:orderId (PaymentScreen)
│   │   └── /track-order/:orderId (OrderTracking)
│   │
│   ├── Admin Routes (Protected)
│   │   ├── /dashboard (Dashboard)
│   │   ├── /dashboard/pending-verification (PendingVerification)
│   │   ├── /dashboard/orders (OrderManagement)
│   │   ├── /dashboard/menu (MenuManagement)
│   │   ├── /dashboard/reports (Reports)
│   │   └── /dashboard/settings (Settings)
│   │
│   └── Kitchen Routes (Protected)
│       └── /kitchen (KitchenDisplay)
│
├── Navbar (Common)
└── ToastContainer (Notifications)
```

### Backend Routes

```
server.js
├── Socket.io Server
│   ├── admin room
│   ├── kitchen room
│   └── order_{orderId} rooms
│
└── Express Routes
    ├── /api/auth (Authentication)
    │   ├── POST /login
    │   ├── GET /me
    │   └── POST /logout
    │
    ├── /api/menu (Menu Management)
    │   ├── GET / (list)
    │   ├── GET /:id
    │   ├── POST / (admin)
    │   ├── PUT /:id (admin)
    │   └── DELETE /:id (admin)
    │
    ├── /api/orders (Order Management)
    │   ├── POST / (create)
    │   ├── GET /:orderId
    │   ├── PUT /:orderId/submit-payment
    │   └── GET /phone/:phone
    │
    ├── /api/admin (Admin Operations)
    │   ├── GET /orders
    │   ├── GET /orders/pending-verification
    │   ├── PUT /orders/:orderId/verify-payment
    │   ├── PUT /orders/:orderId/status
    │   ├── GET /reports/daily
    │   └── GET /reports/summary
    │
    ├── /api/kitchen (Kitchen Operations)
    │   ├── GET /orders
    │   └── PUT /orders/:orderId/status
    │
    └── /api/settings (Settings)
        ├── GET /
        └── PUT / (admin)
```

## Real-time Communication

### Socket.io Events

```
Client Events (Emit):
├── join_admin          → Join admin notification room
├── join_kitchen        → Join kitchen notification room
└── join_order          → Join specific order tracking room

Server Events (On):
├── new_payment_submitted  → To admin room
├── new_verified_order     → To kitchen room
└── order_updated          → To order_{orderId} room
```

## Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. POST /api/auth/login
       │    {username, password}
       ↓
┌─────────────┐
│   Server    │──→ 2. Verify credentials (bcrypt)
└──────┬──────┘
       │ 3. Generate JWT token
       │
       ↓ 4. Return token + user info
┌─────────────┐
│   Client    │──→ 5. Store token (localStorage)
└──────┬──────┘
       │ 6. Include token in headers
       │    Authorization: Bearer <token>
       ↓
┌─────────────┐
│   Server    │──→ 7. Verify token (middleware)
└──────┬──────┘
       │ 8. Attach user to request
       ↓
┌─────────────┐
│  Protected  │
│   Route     │
└─────────────┘
```

## Database Schema Relationships

```
┌──────────────┐
│    Users     │
│──────────────│
│ _id          │
│ username     │◄────┐
│ password     │     │
│ role         │     │
└──────────────┘     │
                     │ verifiedBy
┌──────────────┐     │
│   Orders     │─────┘
│──────────────│
│ _id          │
│ orderId      │
│ studentName  │
│ items[]      │◄────┐
│ status       │     │
│ totalAmount  │     │
└──────────────┘     │
                     │ menuItemId
┌──────────────┐     │
│  MenuItems   │─────┘
│──────────────│
│ _id          │
│ name         │
│ category     │
│ price        │
│ isAvailable  │
└──────────────┘

┌──────────────┐
│   Settings   │
│──────────────│
│ _id          │
│ canteenName  │
│ upiId        │
│ upiQrCode    │
│ contactPhone │
└──────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────┐
│           Security Layers                    │
├─────────────────────────────────────────────┤
│                                              │
│  1. Transport Layer                          │
│     └─ CORS (Cross-Origin Resource Sharing) │
│                                              │
│  2. Authentication Layer                     │
│     ├─ JWT Token Verification                │
│     └─ Bcrypt Password Hashing               │
│                                              │
│  3. Authorization Layer                      │
│     ├─ Role-Based Access Control             │
│     ├─ Admin-only Routes                     │
│     └─ Kitchen-only Routes                   │
│                                              │
│  4. Input Validation Layer                   │
│     ├─ Request Body Validation               │
│     ├─ Query Parameter Validation            │
│     └─ Data Sanitization                     │
│                                              │
│  5. Error Handling Layer                     │
│     ├─ Try-Catch Blocks                      │
│     ├─ Error Middleware                      │
│     └─ User-Friendly Messages                │
│                                              │
└─────────────────────────────────────────────┘
```

## Deployment Architecture

### Development Environment
```
Developer Machine
├── Frontend (localhost:5173)
├── Backend (localhost:5000)
└── MongoDB (localhost:27017)
```

### Production Environment (Recommended)
```
┌─────────────────────────────────────────┐
│            Cloud Platform                │
│         (AWS/Azure/DigitalOcean)        │
├─────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────┐    │
│  │  Reverse Proxy (Nginx)         │    │
│  │  (Port 80/443)                 │    │
│  └──────────┬─────────────────────┘    │
│             │                            │
│  ┌──────────┴──────────┐                │
│  │                     │                │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   Frontend   │  │   Backend    │   │
│  │  (Static)    │  │ (Node.js +   │   │
│  │              │  │  PM2)        │   │
│  └──────────────┘  └──────┬───────┘   │
│                            │            │
│                     ┌──────┴───────┐   │
│                     │   MongoDB    │   │
│                     │  (Cluster)   │   │
│                     └──────────────┘   │
│                                          │
└─────────────────────────────────────────┘
```

## Technology Stack Details

```
┌─────────────────────────────────────────────┐
│              Frontend Stack                  │
├─────────────────────────────────────────────┤
│ • React 18          (UI Framework)          │
│ • Vite              (Build Tool)            │
│ • React Router v6   (Routing)               │
│ • Axios             (HTTP Client)           │
│ • Socket.io-client  (Real-time)             │
│ • Tailwind CSS      (Styling)               │
│ • QRCode.react      (QR Generation)         │
│ • React-Toastify    (Notifications)         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              Backend Stack                   │
├─────────────────────────────────────────────┤
│ • Node.js           (Runtime)               │
│ • Express.js        (Web Framework)         │
│ • MongoDB           (Database)              │
│ • Mongoose          (ODM)                   │
│ • Socket.io         (Real-time)             │
│ • JWT               (Authentication)        │
│ • bcryptjs          (Hashing)               │
│ • CORS              (Security)              │
└─────────────────────────────────────────────┘
```

---

This architecture provides:
- **Scalability**: Can handle multiple concurrent users
- **Security**: Multi-layer security approach
- **Maintainability**: Clear separation of concerns
- **Real-time**: Live updates across all interfaces
- **Flexibility**: Easy to extend and modify
