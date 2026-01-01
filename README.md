# ClubSphere Frontend

<div align="center">

![ClubSphere Logo](https://img.shields.io/badge/ClubSphere-Community%20Platform-blue?style=for-the-badge)

**Connecting people through passions. The world's fastest growing community platform.**

[🌐 Live Demo](https://clubsphere-c7f59.web.app/) 

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Live URLs](#-live-urls)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [The Process](#-the-process)
- [What I Learned](#-what-i-learned)
- [Project Structure](#-project-structure)
- [How to Run the Project](#-how-to-run-the-project)
- [Available Scripts](#-available-scripts)
- [Authentication](#-authentication)
- [Payment Integration](#-payment-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

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

**Problem Solved**: Users need an easy way to discover and connect with communities that match their interests, join clubs, and participate in events with secure payment processing.

**Solutions Implemented**:
- **Browse and Discover Clubs/Events**: Browse clubs and events by category with search and filtering capabilities - solves the problem of finding relevant communities
- **Join Clubs with Secure Payment**: One-click club membership with Stripe payment integration - solves secure payment processing for memberships
- **Register for Events**: Simple event registration with payment handling - enables easy participation in community events
- **Personal Dashboard**: Centralized view of user's clubs, events, and activities - solves organization and tracking of user's community involvement
- **Payment History**: Complete transaction history tracking - solves transparency and record-keeping for financial transactions
- **Profile Management**: Update personal settings and preferences - enables users to maintain their account information

### 🏢 Club Manager Features

**Problem Solved**: Club managers need comprehensive tools to create, manage, and grow their communities, track members, organize events, and monitor club health.

**Solutions Implemented**:
- **Club Creation & Management**: Create and customize club profiles with categories, descriptions, and images - solves the need for establishing an online presence
- **Event Organization**: Create and manage events with registration, pricing, and capacity controls - solves event planning and management challenges
- **Member Management**: View and manage club members, track membership status - solves member relationship management
- **Event Registration Tracking**: Monitor event registrations and attendee lists - solves event attendance management
- **Club Analytics**: View club statistics, member growth, and engagement metrics - solves the need for data-driven decision making
- **Financial Overview**: Track revenue from memberships and events - solves financial monitoring and reporting needs

### 🔐 Admin Features

**Problem Solved**: System administrators need tools to oversee the entire platform, manage users, moderate content, and ensure platform quality and compliance.

**Solutions Implemented**:
- **User Management**: View, edit, and manage all platform users and their roles - solves user administration and access control
- **Club Approval & Moderation**: Review and approve/deny club creation requests - solves content quality control and moderation
- **Event Oversight**: Monitor all events across the platform - solves platform-wide event management
- **Category Management**: Create and manage club categories - solves content organization and discoverability
- **Financial Analytics**: System-wide financial reporting and analytics - solves business intelligence and financial oversight
- **System Configuration**: Platform-wide settings and configuration management - solves system administration needs

## 🛠 Tech Stack

### Core Framework

- **React** `^19.2.0`
  - **Where Used**: All UI components and pages throughout the application
  - **Why Used**: Chosen for its component-based architecture, excellent ecosystem, and strong community support. React's virtual DOM ensures efficient rendering for a dynamic, data-driven application with multiple user roles and real-time updates.

- **Vite** `^7.2.4`
  - **Where Used**: Build tool and development server configuration
  - **Why Used**: Selected for its lightning-fast hot module replacement (HMR) and optimized production builds. Vite's native ESM support and pre-bundling dramatically improve development experience compared to traditional bundlers.

- **React Router** `^7.11.0`
  - **Where Used**: Route configuration in `src/routes/index.jsx` and navigation throughout the app
  - **Why Used**: Essential for a single-page application with multiple protected routes based on user roles. Provides declarative routing with easy route protection and programmatic navigation.

### Styling

- **Tailwind CSS** `^4.1.18`
  - **Where Used**: Primary styling approach for all components, pages, and layouts
  - **Why Used**: Utility-first CSS framework that enables rapid UI development without leaving HTML/JSX. Provides consistent design system, dark mode support, and small production bundle size through purging unused styles.

- **DaisyUI** `^5.5.14`
  - **Where Used**: Component library used alongside Tailwind for pre-built UI components
  - **Why Used**: Accelerates development by providing ready-made, accessible components (modals, dropdowns, forms) that integrate seamlessly with Tailwind, reducing custom CSS writing.

- **Styled Components** `^6.1.19`
  - **Where Used**: Selected components requiring dynamic styling or CSS-in-JS benefits
  - **Why Used**: Provides component-scoped styling and theme support for components that need runtime style calculations or advanced styling logic.

- **Framer Motion** `^11.0.0`
  - **Where Used**: Page transitions, component animations, and interactive UI elements (e.g., card hovers, page load animations)
  - **Why Used**: Powerful animation library that makes it easy to create smooth, performant animations. Enhances user experience with engaging micro-interactions and page transitions.

### State Management & Data Fetching

- **React Query (TanStack Query)** `^5.90.12`
  - **Where Used**: Server state management for API calls throughout the application (clubs, events, users, payments data)
  - **Why Used**: Handles caching, background updates, and synchronization of server state automatically. Eliminates the need for manual loading states, error handling, and refetching logic, making data fetching more reliable and maintainable.

- **React Context API**
  - **Where Used**: Client-side state management for authentication (`AuthContext`) and language preferences (`LanguageContext`)
  - **Why Used**: Built-in React solution perfect for global state that doesn't require frequent updates. Lightweight and sufficient for authentication state and user preferences without adding external dependencies.

### Authentication & Backend

- **Firebase** `^12.7.0`
  - **Where Used**: Authentication (email/password, Google OAuth) and hosting deployment
  - **Why Used**: Provides robust, secure authentication infrastructure with minimal backend code. Firebase Hosting offers fast CDN distribution and easy deployment workflow. Chosen for rapid development and production-ready authentication without building custom auth system.

- **Axios** `^1.13.2`
  - **Where Used**: HTTP client for all API requests in `src/lib/api.js`
  - **Why Used**: Provides interceptors for automatic token injection, better error handling, and request/response transformation. More feature-rich than fetch API and widely used in React ecosystems.

### Payment Processing

- **Stripe** `^8.6.0` & **@stripe/react-stripe-js** `^5.4.1`
  - **Where Used**: Payment pages (`ClubCheckout`, `EventCheckout`) for membership and event registration payments
  - **Why Used**: Industry-leading payment platform with PCI compliance, secure card handling, and robust payment processing. Stripe Elements provides pre-built, secure payment UI components that handle sensitive card data securely without it touching our servers.

### Forms & Validation

- **React Hook Form** `^7.52.0`
  - **Where Used**: All forms throughout the application (login, registration, club creation, event creation, etc.)
  - **Why Used**: Minimal re-renders, excellent performance with large forms, and easy integration with validation libraries. Simplifies form state management and validation logic significantly compared to controlled components.

### UI/UX Libraries

- **React Icons** `^5.3.0`
  - **Where Used**: Icon system throughout the application (navigation, buttons, cards, dashboards)
  - **Why Used**: Comprehensive icon library with consistent styling. Tree-shakeable, so only used icons are included in the bundle.

- **SweetAlert2** `^11.10.0`
  - **Where Used**: User notifications, confirmations, and alerts (success messages, error handling, payment confirmations)
  - **Why Used**: Beautiful, customizable alert dialogs that provide better UX than native browser alerts. Highly configurable and accessible.

- **Lottie React** `^2.4.0`
  - **Where Used**: Loading animations and decorative animations
  - **Why Used**: Enables use of lightweight JSON-based animations (Lottie files) for engaging loading states and micro-interactions.

- **Recharts** `^2.12.0`
  - **Where Used**: Analytics dashboards (admin and manager dashboards) for visualizing data
  - **Why Used**: Flexible, composable charting library built for React. Provides responsive charts for displaying financial data, member statistics, and engagement metrics.

### Internationalization

- **i18next** `^25.7.3` & **react-i18next** `^16.5.0`
  - **Where Used**: Multi-language support throughout the application (English and Bengali)
  - **Why Used**: Industry-standard i18n solution for React applications. Enables easy translation management and language switching for broader user accessibility.

### Development Tools

- **ESLint** `^9.39.1`
  - **Where Used**: Code quality and linting configuration
  - **Why Used**: Ensures code consistency, catches potential bugs, and enforces coding standards across the project.

- **TypeScript Types** (`@types/react`, `@types/react-dom`)
  - **Where Used**: Type definitions for better IDE support and development experience
  - **Why Used**: Provides autocomplete, type checking, and better developer experience even in a JavaScript project through JSDoc type annotations.

## 🔨 The Process

### Phase 1: Planning & Setup
1. **Project Initialization**: Set up the React project with Vite for fast development environment
2. **Architecture Design**: Planned component structure, routing strategy, and state management approach
3. **UI/UX Planning**: Designed user flows for three distinct user roles (Admin, Club Manager, Member)
4. **Technology Selection**: Chose the tech stack based on project requirements, scalability, and developer experience

### Phase 2: Core Infrastructure
1. **Routing Setup**: Implemented React Router with protected routes based on user roles
2. **Authentication System**: Integrated Firebase Authentication with email/password and Google OAuth
3. **Context Providers**: Created AuthContext and LanguageContext for global state management
4. **API Integration**: Set up Axios with interceptors for token management and error handling
5. **Styling Foundation**: Configured Tailwind CSS with custom theme, dark mode, and DaisyUI components

### Phase 3: Public Pages Development
1. **Landing Page**: Built responsive home page with featured clubs and events
2. **Club Discovery**: Implemented clubs listing page with filtering, search, and category-based browsing
3. **Event Browsing**: Created events page with upcoming events and detailed event views
4. **Club & Event Details**: Developed detailed view pages with membership/registration functionality

### Phase 4: Authentication & User Management
1. **Login/Register Pages**: Created authentication forms with React Hook Form validation
2. **Protected Routes**: Implemented role-based route protection using PrivateRoute component
3. **User Dashboard Routing**: Set up automatic redirects based on user roles after authentication

### Phase 5: Member Features
1. **Member Dashboard**: Built personalized dashboard showing user's clubs and events
2. **Club Management**: Implemented club joining, membership management, and discovery features
3. **Event Registration**: Created event registration flow with payment integration
4. **Payment History**: Developed transaction history and payment tracking features
5. **Profile Settings**: Built user settings page for account management

### Phase 6: Club Manager Features
1. **Manager Dashboard**: Created analytics dashboard with club statistics and insights
2. **Club Creation**: Implemented club creation and management interface
3. **Event Management**: Built event creation, editing, and management system
4. **Member Management**: Developed member list and management interface for club managers
5. **Event Registrations**: Created registration tracking and attendee management features

### Phase 7: Admin Features
1. **Admin Dashboard**: Built comprehensive admin dashboard with system-wide analytics
2. **User Management**: Implemented user management interface for admins
3. **Club Moderation**: Created club approval and management system
4. **Category Management**: Built category creation and management interface
5. **Financial Analytics**: Developed system-wide financial reporting and analytics

### Phase 8: Payment Integration
1. **Stripe Setup**: Integrated Stripe payment gateway with secure payment elements
2. **Checkout Flow**: Implemented checkout pages for club memberships and event registrations
3. **Payment Processing**: Created payment success and cancellation handling
4. **Payment History**: Integrated payment tracking across all user roles

### Phase 9: Polish & Optimization
1. **Internationalization**: Added i18next for multi-language support (English/Bengali)
2. **Animations**: Integrated Framer Motion for smooth page transitions and micro-interactions
3. **Error Handling**: Implemented comprehensive error handling and user feedback with SweetAlert2
4. **Performance Optimization**: Optimized React Query caching, code splitting, and bundle size
5. **Responsive Design**: Ensured all pages work seamlessly across desktop, tablet, and mobile devices

### Phase 10: Deployment
1. **Build Optimization**: Configured production build with Vite
2. **Firebase Hosting**: Deployed application to Firebase Hosting with proper routing configuration
3. **Environment Configuration**: Set up environment variables for different deployment stages
4. **Testing & QA**: Performed thorough testing across all user roles and features

## 💡 What I Learned

### Key Learnings

1. **State Management Architecture**
   - Learned the importance of separating server state (React Query) from client state (Context API)
   - Discovered how React Query eliminates most manual loading and error states
   - Understood the trade-offs between different state management solutions

2. **Authentication & Authorization**
   - Gained deep understanding of JWT token management and refresh strategies
   - Learned how to implement role-based access control (RBAC) in React applications
   - Mastered Firebase Authentication integration with custom backend verification

3. **Payment Integration**
   - Learned Stripe payment flow and security best practices
   - Understood PCI compliance requirements and secure payment handling
   - Gained experience with payment intent creation and webhook handling

4. **Component Architecture**
   - Learned to structure large applications with clear separation of concerns
   - Understood the importance of reusable components and prop design
   - Gained experience with compound components and layout patterns

5. **Performance Optimization**
   - Learned React Query caching strategies and stale data management
   - Understood code splitting and lazy loading for better performance
   - Gained experience with optimizing bundle sizes and build configurations

6. **User Experience Design**
   - Learned to design for multiple user roles with different needs and permissions
   - Understood the importance of loading states, error handling, and user feedback
   - Gained experience with responsive design and mobile-first approaches

### What Could Be Improved

1. **Testing**
   - **Current State**: Limited test coverage
   - **Improvement**: Add comprehensive unit tests with Jest/React Testing Library and integration tests for critical user flows

2. **Type Safety**
   - **Current State**: JavaScript with type definitions
   - **Improvement**: Migrate to TypeScript for better type safety, improved IDE support, and fewer runtime errors

3. **State Management**
   - **Current State**: Mix of Context API and React Query
   - **Improvement**: Consider Zustand or Redux Toolkit for more complex client state management if the application grows

4. **Performance**
   - **Current State**: Good performance, but room for optimization
   - **Improvement**: Implement virtual scrolling for long lists, add image optimization/lazy loading, and implement service workers for offline support

5. **Error Handling**
   - **Current State**: Basic error handling with SweetAlert2
   - **Improvement**: Implement centralized error boundary components, better error logging (e.g., Sentry), and more granular error messages

6. **Accessibility**
   - **Current State**: Basic accessibility considerations
   - **Improvement**: Add ARIA labels, keyboard navigation improvements, and screen reader optimization for better WCAG compliance

7. **Documentation**
   - **Current State**: Basic README and code comments
   - **Improvement**: Add Storybook for component documentation, API documentation, and developer onboarding guides

8. **CI/CD Pipeline**
   - **Current State**: Manual deployment
   - **Improvement**: Set up automated testing, linting, and deployment pipelines with GitHub Actions

9. **Real-time Features**
   - **Current State**: Polling-based updates with React Query
   - **Improvement**: Implement WebSocket connections for real-time notifications and updates

10. **Image Optimization**
    - **Current State**: Direct image URLs
    - **Improvement**: Implement image CDN, lazy loading, and responsive image sizes for better performance

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

## 🚀 How to Run the Project

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
