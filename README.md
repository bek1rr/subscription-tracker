# 🚀 SaaS Subscription Tracker

A full-stack subscription management system that helps users track recurring payments, receive automated reminders, and analyze spending patterns.

Built with a production-ready architecture using modern web technologies.

---

## 🧠 Project Overview

SaaS Subscription Tracker is designed to solve a common problem:  
Users often forget recurring payments and lose control over subscription expenses.

This system provides:

- Secure JWT-based authentication
- Subscription lifecycle management
- Automated reminder notifications (cron-based)
- Spending analytics
- RESTful API architecture
- Scalable backend structure

---

## 🏗️ Architecture

This project follows a monorepo structure:

subscription-tracker/
│
├── backend/ → Node.js + Express API
├── frontend/ → React (Vite)
└── README.md

---

## ⚙️ Tech Stack

### 🔹 Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- node-cron (scheduled jobs)
- REST API architecture

### 🔹 Frontend
- React
- Vite
- TailwindCSS
- Axios

---

## 🔐 Features

- User authentication & authorization
- Add / Update / Delete subscriptions
- Subscription status tracking
- Automated payment reminders
- Notification system
- Secure middleware-based route protection
- Scalable folder structure

---

## 📡 API Design

RESTful endpoint structure:


POST /api/auth/register
POST /api/auth/login

GET /api/subscriptions
POST /api/subscriptions
PUT /api/subscriptions/:id
DELETE /api/subscriptions/:id

GET /api/notifications


---

## 🛠️ Installation

### 1️⃣ Clone Repository


git clone https://github.com/bek1rr/subscription-tracker.git

cd subscription-tracker


---

### 2️⃣ Backend Setup


cd backend
npm install


Create a `.env` file inside `backend/`:


DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key


Run migrations:


npx prisma migrate dev


Start server:


npm run dev


---

### 3️⃣ Frontend Setup


cd ../frontend
npm install
npm run dev


---

## 🧪 Future Improvements

- Role-based access control
- Docker containerization
- CI/CD pipeline integration
- Payment gateway integration
- Multi-currency support
- Deployment (Render + Vercel)

---

## 📌 Engineering Notes

- Clean controller-service architecture
- Modular route separation
- Prisma-based schema migrations
- Token-based authentication
- Cron-based background jobs
- Environment-based configuration

---


## 👨‍💻 Author

Bekir Şimşek  
Computer Engineering Student  
Focused on Backend Systems, AI & Scalable Architectures
