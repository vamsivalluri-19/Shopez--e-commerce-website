# ShopEZ - Premium Fashion E-Commerce Platform

ShopEZ is a full-stack, production-ready fashion e-commerce platform inspired by modern luxury design patterns from Apple, Zara, and Nike.

---

## Project Structure

This project is structured as a monorepo:
* **`/backend`**: Node.js + Express + TypeScript backend serving REST APIs, integrated with MongoDB (Mongoose) and featuring an automatic local JSON database fallback (`db_fallback.json`) if MongoDB is unavailable.
* **`/frontend-web`**: React 19 + Vite + TypeScript web application styled with Tailwind CSS, Framer Motion, and Redux Toolkit.
* **`/mobile`**: React Native (Expo) app layout configuration detailing onboarding, shopping catalogs, detail panels, cart management, and order timelines.

---

## Getting Started

### 1. Seeding & Running Backend API
The backend exposes REST APIs for authentication, catalog filtering, checkouts, reviews, admin management, and AI personal styling suggestions.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the database seed script:
   ```bash
   npm run seed
   ```
   *Note: This script registers a default customer (`user@shopez.com` / `userpassword`) and admin (`admin@shopez.com` / `adminpassword`) and seeds premium products.*
4. Launch the local dev server:
   ```bash
   npm run dev
   ```
   The backend API will host on `http://localhost:5050`.

### 2. Running Web Client
1. Navigate to the web client directory:
   ```bash
   cd frontend-web
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
   The web client will host on `http://localhost:5150`. Open this URL in your browser to begin shopping.

### 3. Launching Mobile Mockup App (React Native Expo)
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install Expo CLI and launch the application bundle:
   ```bash
   npm install
   npx expo start
   ```

---

## Features Showcase

### 🌐 Web & Mobile Viewports
* **Zara-Inspired Aesthetics**: Minimalist serif headlines, monochrome themes, card frames, and glassmorphic overlays.
* **Nike-Inspired Micro-Interactions**: Parallax scrolling headers, dynamic CTA layouts, and fluid hover zoom properties.
* **Checkout Coupon Engine**: Validate codes like `EZNEW20` (20% off) at checkout with tax/shipping aggregations.
* **Timeline Order Tracking**: Trace orders through Pending, Packed, Shipped, and Delivered stages.
* **AI Size Recommendations**: Form fields that calculate sizing metrics (XS, S, M, L, XL, XXL) based on BMI indices and preferred fit configurations.
* **AI Shopping chatbot Companion**: Floating AI Stylist that matches outfits, recommends apparel, and outputs custom suggestions.

### 🔐 Auth & Role Credentials
To verify user features and admin dashboard metrics:
* **Admin Login**:
  - Email: `admin@shopez.com`
  - Password: `adminpassword`
* **Regular Customer Login**:
  - Email: `user@shopez.com`
  - Password: `userpassword`
