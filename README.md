<div align="center">

# ☕🎨🚀 Rabuste — Where Coffee Meets Art & Technology

**Rabuste isn’t just a cafe website — it’s a full-stack experience platform**  
Bookings for workshops, a living art gallery with inquiries & purchases, an AI Barista, menu ordering with Razorpay checkout, and an admin command center to manage it all.

<br />

<!-- TODO: Replace with your actual demo link -->
<a href="https://rabuste-omegon.vercel.app" target="_blank"><b>Live Demo</b></a>
·
<!-- TODO: Add your demo video link -->
<a href="#" target="_blank"><b>Video Walkthrough</b></a>
·
<!-- TODO: Add your pitch deck link -->
<a href="#" target="_blank"><b>Pitch Deck</b></a>

<br /><br />

<!-- Badges -->
<img alt="Vite" src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=0B1320" />
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<br />
<img alt="Node.js" src="https://img.shields.io/badge/Node.js-✓-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img alt="Express" src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" />
<img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img alt="Razorpay" src="https://img.shields.io/badge/Razorpay-Payments-0C2451?style=for-the-badge&logo=razorpay&logoColor=white" />
<br />
<img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth%20%26%20Admin-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
<img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-Uploads-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
<img alt="Gemini" src="https://img.shields.io/badge/Gemini-AI%20Barista-1A73E8?style=for-the-badge&logo=google&logoColor=white" />

<br /><br />

<!-- Demo GIF Placeholder -->
<img src="https://placehold.co/1000x500/111827/FFFFFF?text=Demo+GIF+Placeholder+-+Add+your+screen+recording+here" alt="Project Demo GIF Placeholder" />

</div>

---

## ✨ The Hook (Why Rabuste?)

Rabuste was built to **bridge coffee culture with digital convenience**—without losing the soul of the space.

In a modern cafe, people don’t just “buy coffee”. They:
- discover signature brews,
- attend curated workshops,
- explore local artwork,
- and want frictionless checkout.

**Rabuste turns that entire vibe into a scalable platform**:  
a cafe storefront + an event system + an art gallery + a payments layer + admin analytics — backed by a clean, production-style MERN architecture.

---

## 🔥 Key Features (Backed by Real Code)

### ☕ Customer Experience
- **Interactive Menu & Ordering**
  - Browse `Menu Categories` + `Menu Items`
  - Add to cart & checkout
- **Razorpay Payment Integration**
  - Secure order creation + signature verification flow
  - Supports payments for:
    - Menu orders (`MENU`)
    - Art purchases (`ART`)
    - Workshop registrations (`WORKSHOP`)
- **Art Gallery**
  - Browse artworks with `Available / Reserved / Sold` states
  - Send **art inquiries** (stored + email notifications)
  - Purchase art (integrated with payment + status updates)
- **Workshops & Events**
  - Dynamic workshop listing (including **featured** & **upcoming**)
  - Workshop registration with seat count rules (and booking persistence)
  - Inquiry system for private events / corporate sessions / exhibitions
- **AI Barista Chat (Gemini)**
  - Mood-aware recommendations using a curated menu knowledge base
  - Returns structured JSON with optional product lookup from the database
- **Virtual Tour**
  - A `Virtual Tour` page exists (front-end route), built for immersive café storytelling

### 🔐 Authentication & Profiles
- **Firebase Auth + Backend Verification**
  - Firebase ID token verification via `firebase-admin`
- **JWT Backward Compatibility**
  - Backend supports JWT verification via `JWT_SECRET`
- **Profile Aggregation**
  - `/api/profile/data` returns:
    - user orders
    - art purchases
    - workshop bookings

### 🧑‍💼 Admin Command Center
- **Admin Dashboard Routes**
  - Protected admin pages via `ProtectedRoute`
- **Menu Management**
  - Create/update/delete categories & items with image upload
- **Gallery Management**
  - CRUD for artworks
  - Update artwork status + admin stats overview
- **Workshop Management**
  - Create/publish/update/cancel workshops
  - Admin registrations list + status updates
- **Analytics**
  - Sales analytics, category analytics, bestsellers, comprehensive stats

---

## 🧠 Tech Stack (Detected from `package.json`)

### Frontend (`/frontend`)
- **Vite** + **React 18** + **TypeScript**
- **React Router DOM**
- **TailwindCSS** + **tailwindcss-animate**
- **shadcn/ui** primitives via **Radix UI**
- **@tanstack/react-query**
- **Framer Motion**
- **Lucide React**
- **Axios**
- **Firebase (Web SDK)**
- **A-Frame** (for immersive/3D experiences)

### Backend (`/backend`)
- **Node.js** + **Express 5**
- **MongoDB + Mongoose**
- **JWT Auth** (`jsonwebtoken`)
- **Firebase Admin** auth verification
- **Razorpay** payments
- **Nodemailer** (Gmail transport)
- **Multer** + **multer-storage-cloudinary**
- **Cloudinary**
- **Helmet** + **CORS**
- **Google Generative AI SDK** (`@google/generative-ai`)

---

## 🌐✨ Google Technologies (Used in This Project)

<div align="center">

<img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth%20%26%20Analytics-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
<img alt="Google" src="https://img.shields.io/badge/Google%20Sign--In-OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img alt="Firebase Admin" src="https://img.shields.io/badge/Firebase%20Admin-Token%20Verification-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
<img alt="Gemini" src="https://img.shields.io/badge/Gemini-AI%20Barista-1A73E8?style=for-the-badge&logo=google&logoColor=white" />
<img alt="Gmail" src="https://img.shields.io/badge/Gmail-Email%20Automation-EA4335?style=for-the-badge&logo=gmail&logoColor=white" />

</div>

- **[Firebase Authentication (Web SDK)]**
  - Implemented in `frontend/src/firebase.ts` and `frontend/src/services/authService.ts`.
  - Supports **email/password** auth and **Google Sign-In** via `GoogleAuthProvider`.

- **[Firebase Admin (Server-side verification)]**
  - Implemented in `backend/firebase.js` + enforced in `backend/middleware/authMiddleware.js`.
  - The backend verifies Firebase ID tokens (`firebase-admin`) to secure protected APIs.

- **[Firebase Analytics]**
  - Initialized via `getAnalytics()` in `frontend/src/firebase.ts` to enable product analytics.

- **[Google Gemini (AI Barista)]**
  - Implemented with `@google/generative-ai` in `backend/controllers/aiController.js`.
  - Exposed via `POST /api/ai/chat` to generate **mood-based drink recommendations**.

- **[Gmail (Transactional emails via Nodemailer)]**
  - Implemented in `backend/utils/emailSender.js` using Gmail as the transport.
  - Used for art inquiries, workshop/event inquiries, franchise leads, and contact acknowledgements.

- **[reCAPTCHA verifier (Phone auth support)]**
  - The frontend exports `RecaptchaVerifier` and `signInWithPhoneNumber` from Firebase Auth (`frontend/src/firebase.ts`).

---

## 🗂️ Project Structure

```text
Rabuste/
  backend/
    server.js
    config/
      db.js
      cloudinary.js
      multer.js
    controllers/
    middleware/
    models/
    routes/
  frontend/
    src/
      App.tsx
      pages/
      components/
      hooks/
      services/
```

---

## ⚙️ Getting Started (Local Setup)

### 1) Clone
```bash
git clone https://github.com/Sakina152/Rabuste.git
```

### 2) Install Dependencies

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd frontend
npm install
```

### 3) Environment Variables

Create `.env` inside `backend/`:

```env
# Core
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# Payments (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (Nodemailer - Gmail)
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

# AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Firebase Admin (Production only path)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary (Artist portfolio uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create `.env` inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000

# Firebase Web SDK
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

### 4) Run the App

**Backend**
```bash
cd backend
npm run dev
```

**Frontend**
```bash
cd frontend
npm run dev
```

Frontend runs on Vite default port (commonly `http://localhost:5173`) and backend on `http://localhost:5000`.

---

## 🔌 API Overview (Bonus)

Base URL (local): `http://localhost:5000`

### Auth (`/api/auth`)
- `POST /api/auth/register` — Local register (JWT)
- `POST /api/auth/login` — Local login (JWT)
- `POST /api/auth/firebase-login` — Firebase login → backend user record + token
- `GET /api/auth/me` — Get current user (protected)
- `PUT /api/auth/profile` — Update profile (protected)
- `GET /api/auth/users` — Admin only (protected)
- `PUT /api/auth/users/:id/role` — Admin only (protected)

### Menu (`/api/menu`)
- `GET /api/menu/categories` — List categories
- `GET /api/menu/items` — List available menu items
- `POST /api/menu/categories` — Create category (protected + role)
- `DELETE /api/menu/categories/:id` — Soft delete category (protected + role)
- `POST /api/menu/items` — Create menu item (protected + role)
- `PUT /api/menu/items/:id` — Update menu item (protected + role)
- `DELETE /api/menu/items/:id` — Delete menu item (protected + role)

### Workshops (`/api/workshops`)
- `GET /api/workshops` — List workshops
- `GET /api/workshops/upcoming` — Upcoming
- `GET /api/workshops/featured` — Featured
- `GET /api/workshops/:identifier` — Single workshop (slug or id)
- `POST /api/workshops/:id/register` — Register (public route)
- `GET /api/workshops/registrations/:registrationNumber` — Lookup registration
- `PUT /api/workshops/registrations/:registrationNumber/cancel` — Cancel registration
- Admin:
  - `POST /api/workshops` — Create workshop (protected)
  - `PUT /api/workshops/:id` — Update (protected)
  - `PUT /api/workshops/:id/cancel` — Cancel workshop (protected)
  - `DELETE /api/workshops/:id/force` — Force delete (protected)
  - `GET /api/workshops/admin/registrations` — All registrations (protected)
  - `PUT /api/workshops/registrations/:id/status` — Update registration status (protected)
  - `GET /api/workshops/admin/stats` — Workshop stats (protected)

### Art Gallery (`/api/art`)
- `GET /api/art` — List artworks
- `POST /api/art/inquiry` — Submit art inquiry (saves + emails)
- `POST /api/art/purchase/:id` — Purchase art (protected)
- Admin:
  - `POST /api/art` — Add artwork (protected)
  - `PUT /api/art/:id` — Update artwork (protected)
  - `PATCH /api/art/:id/status` — Update status (protected)
  - `DELETE /api/art/:id` — Delete (protected)

### Payments (`/api/payment`) *(protected)*
- `GET /api/payment/config` — Get Razorpay key id
- `POST /api/payment/create-order` — Create Razorpay order (`MENU|ART|WORKSHOP`)
- `POST /api/payment/verify` — Verify signature + persist order/booking

### Profile (`/api/profile`) *(protected)*
- `GET /api/profile/data` — Orders + art purchases + workshop bookings

### Franchise & Contact (`/api/franchise`)
- `POST /api/franchise` — Franchise application (emails)
- `POST /api/franchise/contact` — Contact message (emails)

### Workshop Inquiries (`/api/workshop-inquiries`)
- `POST /api/workshop-inquiries` — Submit inquiry (emails)
- Admin:
  - `GET /api/workshop-inquiries` — List inquiries (protected)
  - `PUT /api/workshop-inquiries/:id/status` — Update status (protected)
  - `DELETE /api/workshop-inquiries/:id` — Delete (protected)

### AI (`/api/ai`)
- `POST /api/ai/chat` — AI Barista mood recommendation (Gemini)

### Analytics (`/api/analytics`) *(protected + admin roles)*
- `GET /api/analytics/sales`
- `GET /api/analytics/categories`
- `GET /api/analytics/bestsellers`
- `GET /api/analytics/comprehensive`

---

## 🖼️ Screenshots (Placeholders)

<!-- Replace these placeholders with real screenshots -->
<div align="center">

<img src="https://placehold.co/900x500/0B1320/FFFFFF?text=Landing+Page" alt="Landing Page Screenshot" />
<br /><br />
<img src="https://placehold.co/900x500/0B1320/FFFFFF?text=Menu+%26+Checkout" alt="Menu & Checkout Screenshot" />
<br /><br />
<img src="https://placehold.co/900x500/0B1320/FFFFFF?text=Gallery+%26+Artwork+Details" alt="Gallery Screenshot" />
<br /><br />
<img src="https://placehold.co/900x500/0B1320/FFFFFF?text=Admin+Dashboard" alt="Admin Dashboard Screenshot" />

</div>

---

## 🧪 Scripts

### Frontend
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview build
- `npm run lint` — lint

### Backend
- `npm run dev` — start with nodemon
- `npm start` — start server

---

## 🚀 Deployment Notes

- Frontend is ready for deployment on platforms like **Vercel / Netlify**.
- Backend can run on **Render / Railway / EC2** (or any Node host).
- Make sure to set:
  - `VITE_API_BASE_URL` on frontend deployment
  - all backend `.env` variables on the server host
- Update backend CORS origins if your deployed frontend URL changes.

---

## 🧩 Roadmap / Next Up
- Role-based admin panels (`menu_admin`, `super_admin`, etc.) fully enforced across all admin APIs
- Proper order authentication middleware on `/api/orders`
- Production-grade logging + rate limiting
- Automated tests for payment verification, workshop seats, and auth flows

---

## 🤝 Contributing
Pull requests are welcome. If you’d like to add a new feature (new workshop types, advanced gallery filtering, loyalty system), open an issue and let’s build.

---

## 📜 License
This project is currently unlicensed (default). Add a license if you plan to open-source publicly.

---

<div align="center">

**Built with bold Robusta energy** ☕  
**Curated with artistic intent** 🎨  
**Shipped with full-stack engineering** 🚀

</div>
