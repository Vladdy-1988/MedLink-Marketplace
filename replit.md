# MedLink House Calls - Healthcare Marketplace

## Overview

MedLink House Calls is a comprehensive healthcare marketplace application that connects patients with healthcare providers for in-home medical services in Calgary, Canada. The application is built as a full-stack web platform using a modern TypeScript-based architecture with Express.js backend, React frontend, and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Modern Dribbble-inspired marketplace design with sophisticated typography.
Branding: MedLink (capital L) with house-with-heart logo design.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express session with PostgreSQL store

### Database Design
- **Primary Database**: PostgreSQL via Neon serverless
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Tables**: users, providers, services, bookings, messages, reviews, sessions

## Key Components

### User Management
- Multi-role system (patient, provider, admin)
- Replit Auth integration for authentication
- User profiles with healthcare-specific fields

### Provider System
- Provider registration and verification workflow
- Service catalog management
- Availability scheduling
- Credential verification system

### Booking System
- Multi-step booking workflow
- Service selection and scheduling
- Payment integration (prepared for Stripe)
- Booking status management

### Communication
- Secure messaging system between patients and providers
- Review and rating system
- Admin oversight capabilities

### Admin Dashboard
- Provider approval workflow
- System analytics and monitoring
- User management capabilities

## Data Flow

### Authentication Flow
1. Users authenticate via Replit Auth (OpenID Connect)
2. Session stored in PostgreSQL with express-session
3. User roles determine access levels and available features

### Booking Flow
1. Patient searches and filters providers
2. Patient selects provider and service
3. Multi-step booking form (service, schedule, contact info)
4. Booking created with pending status
5. Provider receives notification and can accept/decline
6. Payment processing (Stripe integration ready)

### Provider Onboarding
1. Provider registers and submits credentials
2. Admin reviews and approves/rejects application
3. Approved providers can set services and availability
4. Providers gain access to dashboard and booking management

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
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across frontend and backend
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Enabled for both frontend and backend
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPL_ID

### Production Build
- **Frontend**: Vite builds to static assets
- **Backend**: ESBuild bundles Express server
- **Database**: Drizzle migrations run via `db:push` command

### Hosting Considerations
- **Replit Ready**: Optimized for Replit deployment
- **Environment Setup**: Requires PostgreSQL database provisioning
- **SSL/Security**: HTTPS required for authentication and payments

### Monitoring and Logging
- **Request Logging**: Built-in Express middleware for API monitoring
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Performance**: Query optimization through Drizzle ORM

## Recent Changes (January 2025)

### Design System Overhaul
- **Rebranded to MedLink**: Updated logo to house-with-heart design, changed name from "Medlink" to "MedLink" (capital L)
- **Modern Typography**: Implemented Dribbble-inspired design with DM Sans and Inter fonts
- **Enhanced UX**: Added dedicated pages for Services, How It Works, and Emergency Care
- **Navigation Updates**: Fixed all hyperlinks and menu items to have proper dedicated pages
- **Dashboard Improvements**: Removed "Total Spent" feature from patient dashboard, replaced with "Providers Used" metric

### New Pages Added
- **Services Page**: Comprehensive overview of all medical services with emergency care section
- **How It Works Page**: 5-step process explanation with benefits and FAQ sections  
- **Emergency Care Page**: Dedicated page explaining premium pricing for urgent services
- **Optimized Routes**: All menu options now have functional dedicated pages

### Performance Optimizations
- **React Optimization**: Fixed infinite re-rendering issues in provider registration
- **Component Memoization**: Added React.memo and useCallback optimizations throughout
- **Enhanced Caching**: Improved query client configuration with better error handling

## Notable Architectural Decisions

### Database Choice
- **Problem**: Need for reliable, scalable data storage with ACID compliance
- **Solution**: PostgreSQL via Neon serverless
- **Rationale**: Healthcare data requires reliability, and PostgreSQL provides excellent performance with Drizzle ORM integration

### Authentication Strategy
- **Problem**: Secure user authentication and session management
- **Solution**: Replit Auth with OpenID Connect
- **Rationale**: Leverages secure, tested authentication while simplifying user onboarding

### Frontend State Management
- **Problem**: Complex server state synchronization and caching
- **Solution**: TanStack Query for server state, React hooks for local state
- **Rationale**: Reduces boilerplate while providing excellent developer experience and performance

### Component Architecture
- **Problem**: Consistent, accessible UI components
- **Solution**: shadcn/ui built on Radix UI primitives
- **Rationale**: Provides accessibility out-of-the-box while maintaining design flexibility

### API Design
- **Problem**: Clear separation between frontend and backend concerns
- **Solution**: RESTful API with TypeScript schemas shared between client and server
- **Rationale**: Enables type safety across the full stack while maintaining clear boundaries