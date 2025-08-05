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
- **User Management**: Multi-role system (patient, provider, admin), Replit Auth integration, user profiles.
- **Provider System**: Registration, verification, service catalog management, availability scheduling, credential verification.
- **Booking System**: Multi-step booking workflow, service selection, scheduling, payment integration (prepared for Stripe), booking status. Implemented a "Get a Quote" and "Contact provider for quote" system by removing fixed pricing and emphasizing virtual consultations for personalized quotes.
- **Communication**: Secure messaging between patients and providers, review/rating system, admin oversight.
- **Admin Dashboard**: Provider approval workflow, system analytics, user management.
- **Terminology Update**: All "emergency" and "urgent" terminology replaced with "Rapid Services" or ASAP care, with priority scheduling for extra cost.

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
- **Critical Features Implementation (January 2025)**: Implemented complete payment processing with Stripe integration, automated email notifications with SendGrid, real-time messaging system, and provider verification workflow. Added secure payment pages (checkout, booking-success), professional email templates for booking confirmations and status updates, and comprehensive messaging interface for patient-provider communication.
- **Database Schema Updates**: Added Stripe customer/subscription fields to users table, enhanced booking table with payment tracking, and implemented complete CRUD operations for all entities.
- **24/7 Statement Removal**: Removed all "24/7" promises across the entire website to avoid over-committing to round-the-clock service. Replaced with "Daily 7AM-11PM" for rapid services and "Available During Visits" for support hotlines.