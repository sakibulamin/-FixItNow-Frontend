# 🏠 FixItNow — Home Service Marketplace

A full-stack Home Service Marketplace that connects customers with professional technicians for reliable home services. Built with **Next.js, TypeScript, Tailwind CSS, Express.js, PostgreSQL, Prisma, and SSLCommerz**.

FixItNow allows customers to discover services, book technicians, make secure online payments, and share reviews — all through a user-friendly platform.

## 🌐 Live Demo

- **Live Frontend:** [FixItNow Website](https://fix-it-now-frontend-bay.vercel.app)
- **Backend API:** [Backend Server](https://fixitnow-server-ivory.vercel.app)
- **Frontend Repository:** [GitHub Repository](https://github.com/sakibulamin/-FixItNow-Frontend)
- **Backend Repository:** [GitHub Repository](https://github.com/sakibulamin/FixItNow-Backend-API)

## 📖 Project Overview

FixItNow is a home service marketplace designed to make booking professional home services easier and more convenient.

Customers can browse different service categories, find technicians, book services, complete online payments, and leave reviews.

The platform supports three different user roles with dedicated features and permissions.

## 👥 User Roles & Features

### 👤 Customer

- Browse available home services.
- View technician profiles and details.
- Book home services.
- Make online payments using SSLCommerz.
- View booking history.
- Review and rate technicians.
- Update personal profile.

### 🔧 Technician

- Create and manage technician profiles.
- Create and manage services.
- Accept or reject booking requests.
- Update booking status.
- Manage service availability.

### 🛡️ Admin

- Access the admin dashboard.
- View platform statistics.
- Manage users.
- Manage service categories.
- View and monitor all bookings.

## 🔐 Authentication & Authorization

- JWT-based authentication.
- User registration and login.
- Role-Based Access Control (RBAC).
- Protected routes.
- Role-specific permissions.

## 💳 Payment Integration

Integrated **SSLCommerz Payment Gateway** for online transactions.

Supported payment statuses:

- Pending
- Completed
- Failed
- Cancelled

## 🛠️ Technologies Used

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack React Query
- React Hook Form
- Zod
- Axios
- Sonner

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Payment Gateway

- SSLCommerz

### Tools & Deployment

- Git & GitHub
- Postman
- VS Code
- Vercel

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sakibulamin/-FixItNow-Frontend.git
```

### 2. Navigate to the Project Directory

```bash
cd -FixItNow-Frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and configure the required environment variables.

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
```

Add any additional environment variables required by your application.

### 5. Run Development Server

```bash
npm run dev
```

Open your browser:

```text
http://localhost:3000
```

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

## 🚀 Deployment

The frontend application is deployed on Vercel.

[Visit FixItNow](https://fix-it-now-frontend-bay.vercel.app)

## 👨‍💻 Author

**Sakibul Amin**

Full-Stack Developer

- **GitHub:** [github.com/sakibulamin](https://github.com/sakibulamin)
- **Portfolio:** [sakibul-amin.vercel.app](https://sakibul-amin.vercel.app)
- **LinkedIn:** [linkedin.com/in/sakibul-amin7](https://www.linkedin.com/in/sakibul-amin7)
- **Email:** info.sakibulamin@gmail.com

