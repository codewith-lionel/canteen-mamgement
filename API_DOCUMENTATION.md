# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "admin",
  "role": "admin",
  "token": "jwt_token"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "admin",
  "role": "admin",
  "createdAt": "2026-01-31T00:00:00.000Z"
}
```

---

## Menu Endpoints

### Get All Menu Items
```http
GET /menu?category=Breakfast&available=true
```

**Query Parameters:**
- `category` (optional): Filter by category (Breakfast, Lunch, Snacks, Beverages)
- `available` (optional): Filter by availability (true/false)

**Response:**
```json
[
  {
    "_id": "item_id",
    "name": "Idli Sambar",
    "category": "Breakfast",
    "description": "Steamed rice cakes with sambar",
    "price": 40,
    "image": "https://...",
    "isAvailable": true,
    "createdAt": "2026-01-31T00:00:00.000Z"
  }
]
```

### Create Menu Item (Admin Only)
```http
POST /menu
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Dosa",
  "category": "Breakfast",
  "description": "Crispy rice crepe",
  "price": 45,
  "image": "https://...",
  "isAvailable": true
}
```

### Update Menu Item (Admin Only)
```http
PUT /menu/:id
Authorization: Bearer <admin_token>
```

### Delete Menu Item (Admin Only)
```http
DELETE /menu/:id
Authorization: Bearer <admin_token>
```

---

## Order Endpoints

### Create Order
```http
POST /orders
```

**Request Body:**
```json
{
  "studentName": "John Doe",
  "studentPhone": "9876543210",
  "items": [
    {
      "menuItemId": "item_id",
      "quantity": 2
    }
  ],
  "specialInstructions": "Extra spicy"
}
```

**Response:**
```json
{
  "_id": "order_id",
  "orderId": "ORD20260131001",
  "studentName": "John Doe",
  "studentPhone": "9876543210",
  "items": [...],
  "totalAmount": 80,
  "status": "pending_payment",
  "paymentDetails": {
    "upiId": "canteen@oksbi"
  },
  "createdAt": "2026-01-31T00:00:00.000Z"
}
```

### Get Order by ID
```http
GET /orders/:orderId
```

### Submit Payment Confirmation
```http
PUT /orders/:orderId/submit-payment
```

**Response:** Updated order with status "payment_submitted"

### Get Orders by Phone
```http
GET /orders/phone/:phone
```

---

## Admin Endpoints

### Get All Orders
```http
GET /admin/orders?status=verified&page=1&limit=50
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `status` (optional): Filter by status
- `startDate` (optional): Filter by start date (ISO format)
- `endDate` (optional): Filter by end date (ISO format)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

### Get Pending Verification Orders
```http
GET /admin/orders/pending-verification
Authorization: Bearer <admin_token>
```

### Verify/Reject Payment
```http
PUT /admin/orders/:orderId/verify-payment
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "action": "approve",  // or "reject"
  "rejectionReason": "Payment not received"  // required if reject
}
```

### Update Order Status
```http
PUT /admin/orders/:orderId/status
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "preparing"  // verified, preparing, ready, completed, cancelled
}
```

### Get Daily Report
```http
GET /admin/reports/daily?date=2026-01-31
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "date": "2026-01-31",
  "totalOrders": 25,
  "totalRevenue": 2500,
  "avgOrderValue": 100,
  "popularItems": [
    {
      "name": "Idli Sambar",
      "quantity": 50,
      "revenue": 2000
    }
  ],
  "orders": [...]
}
```

### Get Summary Statistics
```http
GET /admin/reports/summary
Authorization: Bearer <admin_token>
```

---

## Kitchen Endpoints

### Get Kitchen Orders
```http
GET /kitchen/orders
Authorization: Bearer <kitchen_token>
```

Returns orders with status: verified, preparing, or ready

### Update Order Status (Kitchen)
```http
PUT /kitchen/orders/:orderId/status
Authorization: Bearer <kitchen_token>
```

**Request Body:**
```json
{
  "status": "preparing"  // preparing, ready, completed
}
```

---

## Settings Endpoints

### Get Settings
```http
GET /settings
```

**Response:**
```json
{
  "canteenName": "College Canteen",
  "upiId": "canteen@oksbi",
  "upiQrCode": "base64_string_or_url",
  "contactPhone": "1234567890"
}
```

### Update Settings (Admin Only)
```http
PUT /settings
Authorization: Bearer <admin_token>
```

---

## WebSocket Events

Connect to: `http://localhost:5000`

### Client → Server Events

```javascript
// Join admin room
socket.emit('join_admin');

// Join kitchen room
socket.emit('join_kitchen');

// Join specific order room
socket.emit('join_order', orderId);
```

### Server → Client Events

```javascript
// New payment submitted (to admin)
socket.on('new_payment_submitted', (order) => {
  console.log('New payment:', order);
});

// New verified order (to kitchen)
socket.on('new_verified_order', (order) => {
  console.log('New order:', order);
});

// Order updated (to specific order room)
socket.on('order_updated', (order) => {
  console.log('Order updated:', order);
});
```

---

## Order Status Flow

```
pending_payment → payment_submitted → verified → preparing → ready → completed
                                    ↓
                                 rejected
```

---

## Error Responses

All endpoints return error responses in this format:

```json
{
  "message": "Error description"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
