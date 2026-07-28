# Aura Collection - Skincare eCommerce Platform 🌿

Aura Collection is a premium, full-stack MERN (MongoDB, Express, React, Node.js) eCommerce platform dedicated to organic skincare. This project features a robust admin dashboard, seamless shopping cart, Wishlist system, comprehensive checkout flow with Stripe, and pixel-perfect responsive UI designed to mimic high-end beauty brands.

---

## 🌟 Key Features
- **Authentication**: JWT-based auth, password hashing, role-based access (User/Admin), Forgot & Reset Password flows.
- **Product Catalog**: Advanced product listing, pagination, categories, robust search, filtering, and image galleries.
- **Shopping Cart & Checkout**: Cart state management, Stripe payment processing, shipping address handling, order summaries.
- **Admin Panel**: Complete CRUD operations for products, categories, users, orders, and coupons. Analytics dashboard with mock data aggregation.
- **User Dashboard**: Order history, profile management, and password updates.
- **Image Handling**: Backend `multer` image uploads for products.
- **Performance**: High Lighthouse scores, optimized React rendering, no console warnings, fully typed robust backend logic.

---

## 📁 Folder Structure Documentation

```text
aura-collection/
├── backend/                   # Node.js + Express API
│   ├── config/                # Database and environment configurations
│   ├── controllers/           # API request handlers (Products, Users, Orders, etc.)
│   ├── middleware/            # Custom error handlers and Auth middleware
│   ├── models/                # Mongoose Database Schemas
│   ├── routes/                # Express API Route definitions
│   ├── data/                  # Seeder files and raw product data
│   ├── uploads/               # Locally stored product image uploads
│   └── server.js              # Main backend entry point
│
└── frontend/                  # React.js (Vite + TailwindCSS)
    ├── src/
    │   ├── api/               # Axios interceptors and configurations
    │   ├── assets/            # Fonts, static icons
    │   ├── components/        # Reusable UI components (ProductCard, Navbar, Footer)
    │   ├── context/           # React Context for global state (Auth, Cart, Shop)
    │   ├── pages/             # Main application pages
    │   │   └── admin/         # Secure admin panel pages
    │   ├── App.tsx            # Main router configuration
    │   └── main.tsx           # React DOM rendering entry point
    └── tailwind.config.js     # Tailwind design system configurations
```

---

## 🚀 Installation Guide

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or Atlas URI)
- Stripe Account (for payments)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/aura-collection.git
cd aura-collection
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
```
Run Database Seeders (Optional, to populate initial products/users):
```bash
npm run data:import
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```
Start the frontend server:
```bash
npm run dev
```

---

## 🔐 Demo Credentials

Use these credentials to access the pre-configured accounts in the local seeded database.

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@example.com` | `123456` |
| **User** | `john@example.com` | `123456` |

---

## 🗄️ MongoDB Schema Documentation

### User Schema (`models/User.js`)
- `firstName`, `lastName`, `email` (unique), `password` (hashed).
- `role`: String enum (`'user'`, `'admin'`). Default: `'user'`.
- `resetPasswordToken`, `resetPasswordExpire` (for password recovery).

### Product Schema (`models/Product.js`)
- `name`, `slug`, `brand`, `category`, `description`.
- `price`, `countInStock`, `rating`, `numReviews`.
- `image` (main), `images` (array of gallery URLs).
- `reviews`: Embedded array containing user ID, name, rating, and comment.

### Order Schema (`models/Order.js`)
- `user`: Reference to User.
- `orderItems`: Array of products purchased, quantities, and snapshot prices.
- `shippingAddress`: Object containing address, city, postal code, country.
- `paymentMethod`, `paymentResult` (Stripe integration details).
- `totalPrice`, `isPaid`, `paidAt`, `isDelivered`, `deliveredAt`.

---

## 📡 API Documentation (Overview)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| **POST** | `/api/users/login` | Authenticate user & get token | Public |
| **POST** | `/api/users` | Register a new user | Public |
| **POST** | `/api/users/forgot-password`| Request password reset email | Public |
| **GET** | `/api/products` | Fetch all products (supports query/pagination)| Public |
| **GET** | `/api/products/:id` | Fetch single product by ID | Public |
| **POST** | `/api/orders` | Create a new order | Private |
| **GET** | `/api/orders/myorders` | Get logged in user's orders | Private |
| **PUT** | `/api/orders/:id/pay` | Update order to paid | Private |
| **GET** | `/api/dashboard` | Get admin analytics data | Admin |
| **POST** | `/api/upload` | Upload a product image | Admin |

---

## ☁️ Deployment Guide (MERN Stack)

### 1. Database: MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist `0.0.0.0/0` in Network Access.
3. Get the connection string and replace `<password>` with your database user password.

### 2. Backend: Render (render.com)
1. Push your code to GitHub.
2. Go to Render, create a new **Web Service**.
3. Connect your repository.
4. **Root Directory**: `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. **Environment Variables**: Add `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL` (your future Vercel URL).
8. Deploy! (Copy the resulting backend URL).

### 3. Frontend: Vercel (vercel.com)
1. Go to Vercel, click **Add New Project**.
2. Import your GitHub repository.
3. **Framework Preset**: Vite
4. **Root Directory**: `frontend`
5. **Environment Variables**: Add `VITE_API_URL` pointing to your deployed Render backend URL (e.g. `https://aura-backend.onrender.com/api`).
6. Deploy!

---

## ✅ Final Deployment Checklist

- [ ] MongoDB Atlas cluster is active and IP access allows Render.
- [ ] Backend is deployed on Render and logs show "MongoDB Connected".
- [ ] Vercel has successfully built the frontend.
- [ ] `VITE_API_URL` in Vercel accurately points to the Render backend (no trailing slashes).
- [ ] Stripe Webhooks are configured with the deployed backend URL (if applicable).
- [ ] `FRONTEND_URL` in Render `.env` is updated to the Vercel domain to prevent CORS issues.
- [ ] Manually tested User Registration on live site.
- [ ] Manually tested Checkout flow on live site.
- [ ] Manually logged into Admin panel and uploaded an image successfully.
