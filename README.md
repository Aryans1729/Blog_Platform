# 🚀 Personal Blog Platform

<div align="center">

![Blog Platform](https://img.shields.io/badge/Blog-Platform-blue?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

**A modern, secure, and feature-rich blog platform built with cutting-edge technologies**

[🌟 Features](#-features) • [🚀 Quick Start](#-quick-start) • [📖 Documentation](#-api-documentation) • [🏗️ Architecture](#️-architecture)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔔 Notification System](#-notification-system)
- [📖 API Documentation](#-api-documentation)
- [🎨 UI Components](#-ui-components)
- [🔒 Security Features](#-security-features)
- [🏗️ Architecture](#️-architecture)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 **Core Functionality**
- **User Authentication**: Secure JWT-based login/signup system
- **Blog Management**: Create, read, update, and delete blog posts
- **Author Filtering**: View posts by specific authors
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Dynamic content loading and updates

### 🔔 **Smart Notification System**
- **Real-time Feedback**: Instant notifications for all user actions
- **Contextual Messages**: Smart notifications with relevant icons and colors
- **Loading States**: Professional loading indicators for async operations
- **Error Handling**: User-friendly error messages with actionable feedback
- **Success Confirmations**: Celebratory messages for completed actions
- **Toast Notifications**: Modern, non-intrusive notification design
- **Auto-dismiss**: Smart timing based on message importance
- **Accessibility**: Screen reader compatible with proper ARIA attributes

### 🔐 **Security Features**
- **Password Hashing**: bcrypt with salt rounds for secure storage
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Input Validation**: Comprehensive server-side validation
- **CORS Protection**: Properly configured cross-origin requests
- **XSS Prevention**: Built-in React and custom protections
- **SQL Injection Prevention**: Parameterized queries

### 🎨 **Modern UI/UX**
- **Tailwind CSS**: Modern, responsive design system
- **Dark Mode Support**: Automatic system preference detection
- **Accessibility**: WCAG compliant with keyboard navigation
- **Loading States**: Smooth loading animations and skeletons
- **Error Handling**: User-friendly error messages and recovery
- **Interactive Feedback**: Immediate visual feedback for all user actions

### 🚀 **Performance**
- **Server-Side Rendering**: Next.js 14 with App Router
- **Static Generation**: Optimized build for faster loading
- **Image Optimization**: Automatic image compression and resizing
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Smart caching strategies for better performance

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/personal-blog-platform.git
   cd personal-blog-platform
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**

   **Backend (.env)**
   ```env
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   
   # Server Configuration
   NODE_ENV=development
   PORT=3001
   
   # Database Configuration (SQLite)
   DB_PATH=./blog.db
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (.env.local)**
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME=Personal Blog Platform
   NEXT_PUBLIC_APP_VERSION=1.0.0
   
   # Notification Configuration
   NEXT_PUBLIC_NOTIFICATION_DURATION=4000
   NEXT_PUBLIC_NOTIFICATION_POSITION=top-right
   ```

4. **Start the development servers**

   **Terminal 1 - Backend**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **UI Components**: Custom component library

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Security**: Helmet.js, CORS
- **Validation**: Custom middleware

### **Development Tools**
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development server
- **Git**: Version control

---

## 📁 Project Structure

```
personal-blog-platform/
├── 📁 backend/                 # Node.js/Express API
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Request handlers
│   │   ├── 📁 middleware/      # Auth & validation
│   │   ├── 📁 models/          # Data models
│   │   ├── 📁 routes/          # API routes
│   │   └── 📄 app.js          # Express app setup
│   ├── 📄 package.json
│   ├── 📄 .env.example        # Environment variables template
│   ├── 📄 .gitignore          # Git ignore rules
│   └── 📄 .env               # Environment variables (not in git)
├── 📁 frontend/                # Next.js application
│   ├── 📁 src/
│   │   ├── 📁 app/             # App Router pages
│   │   │   ├── 📁 components/  # Reusable components
│   │   │   ├── 📁 lib/         # Utilities & API client
│   │   │   │   └── 📄 notifications.ts  # Notification service
│   │   │   ├── 📁 login/       # Login page
│   │   │   ├── 📁 signup/      # Signup page
│   │   │   ├── 📁 dashboard/   # Dashboard page
│   │   │   └── 📁 posts/       # Posts pages
│   │   └── 📁 types/           # TypeScript definitions
│   ├── 📄 package.json
│   ├── 📄 tailwind.config.js
│   ├── 📄 .env.local.example   # Environment variables template
│   ├── 📄 .gitignore          # Git ignore rules
│   └── 📄 .env.local          # Environment variables (not in git)
├── 📄 README.md
├── 📄 sample-blog-posts.md    # Sample content for testing
└── 📄 package.json
```

---

## 🔔 Notification System

The platform features a comprehensive notification system built with React Hot Toast that provides real-time feedback for all user interactions.

### **Features**
- **Smart Contextual Messages**: Different notification types with appropriate icons and colors
- **Loading States**: Professional loading indicators that can be dismissed
- **Auto-dismiss**: Intelligent timing based on message importance
- **Accessibility**: Full screen reader support with ARIA attributes
- **Modern Design**: Beautiful toast notifications that match the app's design language

### **Notification Types**

#### **Success Notifications** ✅
- User authentication (login, signup, logout)
- Post operations (created, updated, deleted)
- General success confirmations

#### **Error Notifications** ❌
- Authentication failures
- API errors
- Form validation errors
- Network issues

#### **Warning Notifications** ⚠️
- Form validation warnings
- Password requirements
- Data loss warnings

#### **Info Notifications** ℹ️
- General information
- Tips and guidance
- Status updates

#### **Loading Notifications** ⏳
- Async operation progress
- API call indicators
- Processing states

### **Usage Examples**

```typescript
import { notifications } from '@/lib/notifications';

// Success notification
notifications.success.postCreated('My New Blog Post');

// Error notification
notifications.error.loginFailed();

// Loading notification
const loadingToast = notifications.loading.general('Creating post...');
// Dismiss when done
notifications.dismiss(loadingToast);

// Promise-based notification
notifications.promise(
  apiCall(),
  {
    loading: 'Saving post...',
    success: 'Post saved successfully!',
    error: 'Failed to save post'
  }
);
```

### **Configuration**

The notification system can be configured via environment variables:

```env
# Frontend .env.local
NEXT_PUBLIC_NOTIFICATION_DURATION=4000
NEXT_PUBLIC_NOTIFICATION_POSITION=top-right
```

### **Customization**

Notifications are fully customizable with:
- Custom colors and styling
- Configurable positioning
- Adjustable duration
- Custom icons and emojis
- Theme integration

---

## 📖 API Documentation

### **Authentication Endpoints**

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

### **Post Endpoints**

#### Get All Posts
```http
GET /api/posts
GET /api/posts?author=123  # Filter by author
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "My Blog Post",
  "content": "This is the content of my blog post..."
}
```

#### Get User's Posts
```http
GET /api/posts/my
Authorization: Bearer <jwt-token>
```

#### Update Post
```http
PUT /api/posts/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Post
```http
DELETE /api/posts/:id
Authorization: Bearer <jwt-token>
```

### **Response Format**

All API responses follow this consistent format:

```json
{
  "message": "Operation successful",
  "data": { /* response data */ },
  "error": null
}
```

Error responses:
```json
{
  "error": "Error message",
  "details": "Detailed error description",
  "statusCode": 400
}
```

---

## 🎨 UI Components

### **Pages**
- **Homepage** (`/`): Featured posts and platform introduction
- **Login** (`/login`): User authentication with notification feedback
- **Signup** (`/signup`): User registration with validation notifications
- **Dashboard** (`/dashboard`): User's post management with action confirmations
- **Posts** (`/posts`): Public post listing with filtering

### **Components**
- **Header**: Navigation with authentication state and logout notifications
- **PostCard**: Reusable post display component with action feedback
- **AuthProvider**: Global authentication context
- **ProtectedRoute**: Route protection wrapper
- **LoadingSpinner**: Consistent loading states
- **NotificationService**: Centralized notification management

### **Design System**
- **Colors**: Modern blue/purple gradient palette
- **Typography**: Inter font family with responsive scaling
- **Spacing**: Consistent 8px grid system
- **Shadows**: Layered shadow system for depth
- **Animations**: Smooth transitions and micro-interactions
- **Notifications**: Consistent toast styling with theme integration

---

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Token Expiration**: Configurable token lifetime
- **Route Protection**: Client and server-side guards

### **Data Protection**
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: React's built-in + custom sanitization
- **CORS Configuration**: Proper cross-origin settings

### **Security Headers**
- **Helmet.js**: Security headers middleware
- **Content Security Policy**: XSS protection
- **HTTPS Enforcement**: Production security
- **Rate Limiting**: API abuse prevention

---

## 🏗️ Architecture

### **Backend Architecture**
- **MVC Pattern**: Clean separation of concerns
- **Middleware Stack**: Reusable request processing
- **Database Layer**: Abstracted database operations
- **Error Handling**: Centralized error management

### **Frontend Architecture**
- **App Router**: Next.js 14 routing system
- **Server Components**: Optimized rendering
- **Client Components**: Interactive elements
- **Context API**: Global state management
- **Notification Layer**: Centralized user feedback system

### **Key Design Decisions**

#### **Why Next.js 14?**
- Server-side rendering for better SEO
- App Router for improved performance
- Built-in TypeScript support
- Automatic code splitting

#### **Why SQLite?**
- Zero-configuration database
- Perfect for development and small deployments
- Easy to migrate to PostgreSQL/MySQL later
- File-based storage simplicity

#### **Why JWT?**
- Stateless authentication
- Scalable across multiple servers
- Mobile-friendly
- Industry standard

#### **Why React Hot Toast?**
- Lightweight and performant
- Excellent accessibility support
- Highly customizable
- Great developer experience

---

## 🧪 Testing

### **Running Tests**

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

### **Test Coverage**
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing
- **Security Tests**: Authentication and authorization
- **Notification Tests**: Toast notification functionality

---

## 🚀 Deployment

### **Production Build**

```bash
# Build frontend
cd frontend
npm run build

# Start production servers
cd ../backend
npm start

cd ../frontend
npm start
```

### **Environment Variables**

#### **Backend Production (.env)**
```env
# JWT Configuration
JWT_SECRET=your-production-jwt-secret-64-characters-minimum
NODE_ENV=production
PORT=3001

# Database Configuration
DB_PATH=./blog.db

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Security
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
```

#### **Frontend Production (.env.local)**
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Personal Blog Platform
NEXT_PUBLIC_APP_VERSION=1.0.0

# Notification Configuration
NEXT_PUBLIC_NOTIFICATION_DURATION=4000
NEXT_PUBLIC_NOTIFICATION_POSITION=top-right
```

### **Deployment Options**
- **Vercel**: Frontend deployment with automatic builds
- **Railway/Render**: Backend deployment with database persistence
- **Docker**: Containerized deployment for both services
- **VPS**: Traditional server deployment with PM2 process management

### **Production Checklist**
- [ ] Update JWT_SECRET to a secure 64+ character string
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Test notification system in production environment
- [ ] Verify all environment variables are set
- [ ] Test authentication flows
- [ ] Validate notification delivery

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Add appropriate notifications for new user actions
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using modern web technologies**

[⭐ Star this repo](https://github.com/your-username/personal-blog-platform) • [🐛 Report Bug](https://github.com/your-username/personal-blog-platform/issues) • [✨ Request Feature](https://github.com/your-username/personal-blog-platform/issues)

</div> 