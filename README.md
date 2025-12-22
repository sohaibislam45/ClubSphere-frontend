# ClubSphere Frontend

<div align="center">

![ClubSphere Logo](https://img.shields.io/badge/ClubSphere-Community%20Platform-blue?style=for-the-badge)

**Connecting people through passions. The world's fastest growing community platform.**

[🌐 Live Demo](https://clubsphere-c7f59.web.app/) 

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Live URLs](#live-urls)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

ClubSphere is a comprehensive community management platform that enables users to discover, join, and manage clubs and events. The platform supports three distinct user roles—Administrators, Club Managers, and Members—each with tailored features and dashboards.

### Key Capabilities

- **Club Discovery**: Browse and explore clubs by category
- **Event Management**: Create, manage, and register for events
- **Payment Processing**: Secure payment handling for club memberships and event registrations
- **Role-Based Access**: Multi-role system with appropriate permissions
- **Real-Time Updates**: Dynamic data fetching and state management
- **Responsive Design**: Optimized for all device sizes

## 🌐 Live URLs

### Frontend Application
**Production URL**: [https://clubsphere-c7f59.web.app/](https://clubsphere-c7f59.web.app/)

### Backend API
**API Base URL**: [https://clubsphere-backend.vercel.app/](https://clubsphere-backend.vercel.app/)

## ✨ Features

### 👥 Member Features
- Browse and discover clubs and events
- Join clubs with secure payment processing
- Register for events
- Manage personal dashboard
- View payment history
- Update profile settings

### 🏢 Club Manager Features
- Create and manage clubs
- Organize and manage events
- View and manage club members
- Track event registrations
- Monitor club analytics
- Financial overview

### 🔐 Admin Features
- User management
- Club approval and management
- Event oversight
- Category management
- Financial analytics and reporting
- System-wide configuration

## 🛠 Tech Stack

### Core Framework
- **React** `^19.2.0` - UI library
- **Vite** `^7.2.4` - Build tool and dev server
- **React Router** `^7.11.0` - Client-side routing

### Styling
- **Tailwind CSS** `^4.1.18` - Utility-first CSS framework
- **DaisyUI** `^5.5.14` - Component library for Tailwind
- **Styled Components** `^6.1.19` - CSS-in-JS styling
- **Framer Motion** `^11.0.0` - Animation library

### State Management & Data Fetching
- **React Query (TanStack Query)** `^5.90.12` - Server state management
- **React Context API** - Client state management

### Authentication & Backend
- **Firebase** `^12.7.0` - Authentication and hosting
- **Axios** `^1.13.2` - HTTP client

### Payment Processing
- **Stripe** `^8.6.0` - Payment gateway integration
- **@stripe/react-stripe-js** `^5.4.1` - React components for Stripe

### Forms & Validation
- **React Hook Form** `^7.52.0` - Form state management

### UI/UX Libraries
- **React Icons** `^5.3.0` - Icon library
- **SweetAlert2** `^11.10.0` - Beautiful alert dialogs
- **Lottie React** `^2.4.0` - Animation support
- **Recharts** `^2.12.0` - Chart library for analytics

### Development Tools
- **ESLint** `^9.39.1` - Code linting
- **TypeScript Types** - Type definitions for better DX

## 📁 Project Structure

```
clubsphere-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, and other assets
│   ├── components/         # Reusable React components
│   │   ├── layout/        # Layout components (Navbar, Footer, Sidebars)
│   │   ├── routes/        # Route protection components
│   │   └── ui/            # UI components (Cards, Loaders)
│   ├── context/           # React Context providers
│   ├── firebase/          # Firebase configuration
│   ├── lib/               # Utility libraries and configurations
│   ├── pages/             # Page components
│   │   ├── Admin*         # Admin dashboard pages
│   │   ├── Manager*       # Club manager pages
│   │   ├── Member*        # Member pages
│   │   └── ...            # Public pages (Home, Clubs, Events, etc.)
│   ├── routes/            # Route configuration
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── .firebase/             # Firebase configuration
├── .github/               # GitHub workflows and templates
├── dist/                  # Production build output
├── firebase.json          # Firebase hosting configuration
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>=18.0.0`
- **npm** `>=9.0.0` or **yarn** `>=1.22.0`
- **Firebase CLI** (for deployment)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clubsphere-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://clubsphere-backend.vercel.app
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in the terminal)

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot module replacement |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🔐 Authentication

ClubSphere uses **Firebase Authentication** for user management. The platform supports:

- Email/Password authentication
- Google Sign-In
- Role-based access control (Admin, Club Manager, Member)

Authentication state is managed through React Context (`AuthContext`) and protected routes ensure users have appropriate permissions.

## 💳 Payment Integration

The application integrates with **Stripe** for secure payment processing:

- Club membership payments
- Event registration fees
- Payment success/cancel handling
- Payment history tracking

Stripe Elements are used for secure card input, and payment intents are handled through the backend API.

## 🚢 Deployment

### Firebase Hosting

The application is deployed on Firebase Hosting. To deploy:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Environment Variables

Ensure all environment variables are configured in your Firebase project settings or CI/CD pipeline.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow ESLint rules
- Use meaningful variable and function names
- Write comments for complex logic
- Maintain consistent formatting

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support, email [sohaibislam45@gmail.com] or open an issue in the repository.

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Stripe](https://stripe.com/) - Payment processing

---

<div align="center">

**Built with ❤️ by the ClubSphere Team**

[⬆ Back to Top](#clubsphere-frontend)

</div>
