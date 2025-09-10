# Neomart – Backend E-Commerce System

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=opensourceinitiative&logoColor=black"/>
</p>

## Overview

Neomart is a **modular, scalable, and secure E-commerce backend system** built with **Node.js** and **Express.js**.

It provides RESTful APIs for managing products, users, orders, payments, and more—designed for real-world E-commerce applications.

- Modular architecture for better scalability and maintainability.
- Secure authentication and role-based access control.
- Seamless integration with **Stripe** for payments and **Cloudinary** for media management.
- Follows best practices for validation, error handling, and security.

---

## Features

- 🔑 User authentication & authorization (JWT).
- 👨‍💻 Role-based access control (Admin / User / Seller).
- 📦 Product catalog management (CRUD, slugs, image upload via Cloudinary).
- 🛒 Cart & wishlist management.
- 💳 Order creation, checkout, and payment via Stripe.
- 📨 Email notifications with Nodemailer.
- 🔒 Security features: bcrypt password hashing, rate limiting, CORS, request validation.
- ✅ Input validation with Joi.
- 📊 Categories, subcategories, and brand management.
- ⭐ Reviews and ratings system.
- 🎟️ Coupon management for discounts.

---

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcrypt
- **Validation**: Joi + Validator
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Payment**: Stripe
- **Utilities**: Date-fns, Slugify, Nanoid, Randomatic
- **Security**: Express-rate-limit, CORS, dotenv

---

## Project Structure

```bash
NeoMart/
├── config/
├── controllers/
├── middleware/
├── modules/
├── routes/
├── utils/
├── validation/
├── index.js
├── package.json
├── package-lock.json
```

---

## Installation

```bash
# Clone repository
git clone https://github.com/ahmedradwan03/Neomart.git

cd neomart

# Install dependencies
npm install
```

---

## **Running the App**

```bash
# Development mode (with nodemon)
npm start
```

---

## Environment Variables

Create a `config.env` file in the root of the project.

Use `.env.example` as a template.

```bash
SITE_NAME=neomart
NODE_ENV=development
PORT=3000
CONNECTION_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/Neomart?retryWrites=true&w=majority
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRES_IN=3600
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SITE_DOMAIN=http://localhost:3000
```

---

## Example API Endpoints

### Auth

- **POST** `/auth/signup` – Register new user
- **GET** `/auth/activateAccount/:token` – Activate account
- **POST** `/auth/login` – Login
- **GET** `/auth/logout` – Logout
- **POST** `/auth/forgotPassword` – Send reset code
- **POST** `/auth/resetPassword` – Reset password
- **PATCH** `/auth/updatePassword` – Update password

---

### Users

- **GET** `/users/me` – Get current user profile
- **PATCH** `/users` – Update profile
- **PUT** `/users` – Deactivate account
- **GET** `/users` – [Admin] Get all users
- **POST** `/users` – [Admin] Create user
- **PATCH** `/users/:id` – [Admin] Update user
- **DELETE** `/users/:id` – [Admin] Delete user

---

### Cart

- **GET** `/carts` – Get user cart
- **POST** `/carts` – Add product to cart
- **PATCH** `/carts` – Update cart
- **PATCH** `/carts/:productId` – Remove product from cart
- **PUT** `/carts/applyCoupon` – Apply coupon
- **PUT** `/carts/removeCoupon` – Remove coupon
- **PUT** `/carts` – Clear cart

---

### Wishlist

- **GET** `/wishlists` – Get user wishlist
- **POST** `/wishlists` – Add to wishlist
- **DELETE** `/wishlists/:productId` – Remove from wishlist

---

### Categories & Subcategories

- **GET** `/categories` – Get all categories
- **POST** `/categories` – [Admin] Create category
- **PATCH** `/categories/:id` – [Admin] Update category
- **DELETE** `/categories/:id` – [Admin] Delete category
- **GET** `/categories/:categoryId/subcategories` – Get subcategories of category
- **POST** `/subcategories` – [Admin] Create subcategory
- **PATCH** `/subcategories/:id` – [Admin] Update subcategory
- **DELETE** `/subcategories/:id` – [Admin] Delete subcategory

---

### Brands

- **GET** `/brands` – Get all brands
- **POST** `/brands` – [Admin] Create brand
- **PATCH** `/brands/:id` – [Admin] Update brand
- **DELETE** `/brands/:id` – [Admin] Delete brand

---

### Products

- **GET** `/products` – Get all products
- **POST** `/products` – [Seller] Create product
- **PATCH** `/products/:id` – [Seller] Update product
- **DELETE** `/products/:id` – [Seller] Delete product

---

### Reviews

- **POST** `/reviews/:productId` – Add review
- **PATCH** `/reviews/:productId/:id` – Update review
- **DELETE** `/reviews/:productId/:id` – Delete review

---

### Coupons

- **GET** `/coupons` – Get all coupons
- **POST** `/coupons` – [Admin] Create coupon
- **PATCH** `/coupons/:name` – [Admin] Update coupon
- **DELETE** `/coupons/:name` – [Admin] Delete coupon

---

### Orders

- **GET** `/orders` – [User/Admin] Get all orders
- **POST** `/orders` – [User] Create order
- **PUT** `/orders/:id/cancel` – [User] Cancel order
- **PUT** `/orders/:id/deliver` – [Seller] Mark order as delivered
- **PUT** `/orders/:id/status` – [Seller] Update order status

---

## License

© 2024 [Ahmed Radwan]. Licensed under the MIT License.
