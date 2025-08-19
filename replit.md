# MedLink House Calls - Healthcare Marketplace

## Overview
MedLink House Calls is a comprehensive healthcare marketplace connecting patients with healthcare providers for in-home medical services in Calgary, Canada. This full-stack web platform aims to streamline access to in-home care, built with a modern TypeScript-based architecture. The project's vision is to become the leading platform for in-home healthcare services, offering a seamless and personalized experience for both patients and providers.

## User Preferences
Preferred communication style: Simple, everyday language.
Design preference: Modern Dribbble-inspired marketplace design with sophisticated typography.
Branding: MedLink (capital L) with house-with-heart logo design.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript (Vite build tool)
- **Styling**: Tailwind CSS with shadcn/ui component library, Radix UI primitives
- **State Management**: TanStack Query for server state
- **Routing**: Wouter
- **UI/UX Decisions**: Apple-inspired visual design with full-width lifestyle backgrounds, large typography (text-6xl to text-9xl), generous whitespace, glassmorphism effects, smooth scroll transitions, enhanced UX elements (scroll indicators, backdrop blur effects), rounded buttons with shadows, and smooth transition animations. Rebranded logo to a clean house outline with a centered heart. Implemented modern typography using DM Sans and Inter fonts. Provider cards redesigned with Apple/Airbnb-inspired aesthetics and hover animations. Cohesive hero sections across the site.

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express session with PostgreSQL store

### Database Design
- **Primary Database**: PostgreSQL via Neon serverless
- **Schema Management**: Drizzle Kit
- **Key Tables**: users, providers, services, bookings, messages, reviews, sessions

### Key Components & Features
- **User Management**: Multi-role system (patient, provider, admin), Replit Auth integration, user profiles with complete CRUD operations.
- **Provider System**: Registration, verification, service catalog management, availability scheduling, credential verification with document upload workflow.
- **Booking System**: Multi-step booking workflow, service selection, scheduling, Stripe payment integration with Canadian dollar support, booking status tracking. Implemented "Get a Quote" system emphasizing virtual consultations for personalized quotes.
- **Communication**: Real-time secure messaging between patients and providers, review/rating system, admin oversight with conversation management.
- **Payment Processing**: Complete Stripe integration with secure checkout pages, payment intent management, Canadian pricing support.
- **Email Notifications**: Professional SendGrid email templates for booking confirmations, status updates, and system notifications.
- **Admin Dashboard**: Provider approval workflow, system analytics, user management, verification oversight.
- **API Architecture**: Comprehensive REST API with proper authentication, search functionality, and data validation.

### Data Flow
- **Authentication Flow**: Replit Auth, session in PostgreSQL, role-based access.
- **Booking Flow**: Patient searches, selects provider/service, multi-step booking, booking creation (pending status), provider notification/acceptance, payment processing.
- **Provider Onboarding**: Registration, admin approval, service/availability setup.

### Performance Optimizations
- React optimization (infinite re-rendering fixes), component memoization (React.memo, useCallback), enhanced query client caching, Framer Motion for animations.

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL hosting
- **Connection Pooling**: Built-in connection management

### Authentication
- **Replit Auth**: OpenID Connect provider
- **Session Storage**: PostgreSQL-based session store

### UI/UX
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Icon library (replaced Font Awesome)
- **shadcn/ui**: Component library

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across frontend and backend
- **ESLint/Prettier**: Code quality and formatting

## Recent Changes
- **Admin Portal Complete (August 2025)**: Built comprehensive admin portal at `/admin-portal` with full healthcare marketplace management capabilities.
  - ✅ **Dashboard**: Real-time statistics with total bookings, active providers, pending approvals, revenue tracking, and platform ratings
  - ✅ **Provider Management**: Complete provider oversight with approval/verification workflow, status management (approve/verify/suspend), and detailed provider information display
  - ✅ **Booking Management**: Comprehensive booking oversight with filtering by date/status, complete booking lifecycle tracking, and payment status monitoring
  - ✅ **Patient Feedback**: Review management system with rating display, comment moderation, and admin response capabilities
  - ✅ **Secure Access**: Admin-only authentication with Replit Auth integration and role-based access control
  - ✅ **Real Data Integration**: Uses authentic database queries with comprehensive join operations for real-time platform insights
- **Enhanced Database Operations**: Added comprehensive admin storage methods for platform statistics, complete provider/booking/review/user management with optimized SQL queries.
- **Multi-Admin Access (August 2025)**: Granted admin privileges to multiple users (martinezar.paula@icloud.com, paula@mymedlink.ca, vlad@mymedlink.ca) for comprehensive platform management and administrative oversight.
- **System Launch Ready (August 2025)**: Completed comprehensive implementation of all critical healthcare marketplace features. Platform is now fully operational with authentic sample data and tested functionality across all core systems.
- **Complete Feature Implementation**: 
  - ✅ Stripe payment processing with Canadian dollar support and secure checkout
  - ✅ SendGrid email notifications for booking confirmations and updates
  - ✅ Real-time messaging system between patients and providers
  - ✅ Provider verification workflow with document upload capabilities
  - ✅ Enhanced database schema with payment tracking and user management
  - ✅ Working API endpoints with proper authentication and search functionality
- **Sample Data Population**: Added realistic Canadian healthcare providers, services, bookings, and user data for Calgary market including proper addresses, pricing, and medical specializations.
- **Comprehensive Testing Completed**: All major API endpoints tested and verified working, database fully populated with sample data (5 users, 2 providers, 6 services, 1 booking, 3 messages).