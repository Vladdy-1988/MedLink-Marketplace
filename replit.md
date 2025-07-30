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

## Recent Changes (July 2025)

### Pricing Model Overhaul (Latest - July 21, 2025)
- **Complete Pricing Removal**: Eliminated all fixed pricing information site-wide including service cards, provider profiles, rapid services, and provider registration forms
- **Get Quote System**: Replaced all pricing with "Get a Quote" and "Contact provider for quote" messaging to reflect individualized pricing based on specific case requirements
- **Virtual Consultation First**: Added emphasis on virtual consultations as the first step for patients to discuss needs and receive personalized quotes from providers
- **Provider Registration Updates**: Removed hourly rate and base pricing fields from provider registration forms since pricing will be handled through individual consultations
- **Updated Call-to-Actions**: Changed messaging throughout the site to emphasize contacting providers for personalized quotes rather than fixed pricing
- **Database Schema Ready**: Maintained pricing fields in database schema for when providers set individual rates during consultations, but removed from public display
- **Insurance Information Retained**: Kept insurance coverage information as it remains relevant regardless of individualized pricing
- **Hero Background Update**: Updated to authentic multigenerational family photo showing family celebrating at home with balloons, perfectly representing the home healthcare theme and creating emotional connection to family-centered care values with enhanced transparency overlays for optimal text readability
- **Quote Button Implementation**: Added "Message Provider" buttons throughout provider profiles, service cards, and provider cards that trigger messaging functionality to providers
- **Messaging Integration**: All message requests now trigger direct messaging to providers for personalized consultation and pricing
- **Button Text Update**: Changed all "Get Quote" buttons to "Message Provider" site-wide for clearer call-to-action messaging
- **Homepage Services Cleanup**: Removed "Message Provider" pricing display from Most Popular Services section on homepage for cleaner service card appearance
- **Navigation Enhancement**: Added ScrollToTop component to automatically scroll to top of page when navigating between routes for improved user experience
- **Service Card Fix**: Fixed calls to action in "Complete Healthcare Solutions" section - replaced non-functional alert popups with proper navigation to providers page for meaningful user flow
- **Discount Removal**: Removed "All new patients get their first consultation at 20% off" promotional text from How It Works page to align with personalized quote-based pricing model
- **Service Card Spacing**: Added proper vertical spacing between insurance information and "Find Providers" button in service cards for better visual hierarchy and readability
- **Complete Service Catalog Integration**: Updated providers page to include all 16 services from service catalog in both dropdown and sidebar filters, added 7 new providers covering missing specialties, and improved filtering logic for better service matching
- **Rapid Services Grouping**: Added rapid services filter option to providers page with toggle button and sidebar checkbox, marked select providers as offering ASAP care, added blue "Rapid" badges to provider cards, and updated page headings to show "Rapid Service Providers" when filtered

## Recent Changes (January 2025)

### Apple-Inspired Visual Design Overhaul (Latest - July 21, 2025)
- **Homepage Hero Section**: Redesigned with full-width lifestyle background, Apple-style typography (text-6xl to text-9xl headlines), and generous whitespace
- **Apple Pencil Design Inspiration**: Applied Apple's clean aesthetic across all informational pages (How It Works, About, Rapid Services) with large headlines, smooth scroll transitions, and glassmorphism effects
- **Enhanced UX Elements**: Added scroll indicators, backdrop blur effects, rounded buttons with shadows, and smooth transition animations
- **Patient Dashboard Optimization**: Removed "Total Spent" metric as requested for MVP, keeping only essential metrics (Upcoming, Completed, Providers Used)
- **Button Visibility Fix**: Fixed invisible "Learn More" button on Rapid Services page with proper border styling and shadow effects
- **Comprehensive Footer System**: Implemented healthcare-focused footers across all pages with contact information, emergency disclaimers, and organized navigation sections
- **How It Works Page Redesign**: Completely redesigned using Kindred reference with clean sections, member testimonials, organized FAQs, and modern card layouts
- **Professional Healthcare Images**: Added custom SVG illustrations throughout the site including step-specific graphics, background medical icons, and enhanced visual elements while removing top service card illustrations as requested  
- **Services Page Cleanup**: Removed top illustrations from individual service cards for cleaner, more focused design
- **How It Works Optimization**: Removed pricing calculator section and fixed logo display issue in footer for cleaner page flow
- **About Page Redesign**: Complete redesign using Fora Travel reference with modern hero section, founder profiles with avatar initials, mission/promise sections, and clean Fora-inspired layout structure
- **Cohesive Hero Sections**: Unified all hero sections across the site with Apple-inspired design pattern featuring large typography (text-6xl to text-9xl), gradient backgrounds, two-line headlines with gradient text, scroll indicators, and consistent CTA buttons

### Terminology and Branding Update 
- **Emergency to Rapid Services**: Completely eliminated all "emergency" and "urgent" terminology across the entire application
- **ASAP Positioning**: Repositioned all services as ASAP assistance with priority scheduling for extra cost, completely avoiding emergency/urgent associations
- **Color Scheme Update**: Replaced red/orange branding with blue/purple rapid service theme  
- **Route Updates**: Changed `/emergency-care` to `/rapid-services` throughout the application
- **Content Alignment**: Updated all service descriptions, pricing, and messaging to reflect ASAP but non-emergency care positioning
- **Rapid Response Protocols**: Completely removed "Rapid Response Protocols" section from Safety & Trust page
- **Footer Navigation**: Added comprehensive footer to patient dashboard page for consistency across all signed-in views

### Design System Overhaul
- **Rebranded to MedLink**: Updated logo to house-with-heart design, changed name from "Medlink" to "MedLink" (capital L)
- **Logo Redesign**: Updated to clean house outline with rounded corners, no door, and perfectly centered heart (matching reference design)
- **Provider Cards**: Complete Apple/Airbnb-inspired redesign with modern aesthetics, hover animations, and glassmorphism effects
- **Modern Typography**: Implemented Dribbble-inspired design with DM Sans and Inter fonts
- **Enhanced UX**: Added dedicated pages for Services, How It Works, and Emergency Care
- **Navigation Updates**: Fixed all hyperlinks and menu items to have proper dedicated pages
- **Dashboard Improvements**: Removed "Total Spent" feature from patient dashboard, replaced with "Providers Used" metric

### Apple-Inspired Provider Profiles
- **Full-Screen Hero Sections**: Implemented dramatic gradients and parallax effects
- **Glassmorphism Design**: Added backdrop blur effects and subtle transparency
- **Smooth Animations**: Interactive elements with sophisticated transitions
- **Premium Typography**: Apple-style large headings with gradient text effects
- **Enhanced Visual Hierarchy**: Better spacing and modern card layouts

### Comprehensive Service Catalog
- **Core Medical Services**: Added 8 essential healthcare services including General Practice, Nursing, Physical Therapy, Occupational Therapy, Palliative Care, Mobile Lab Tests, Mental Health, and Vaccinations
- **Specialized Services**: Added 8 additional services including Dental Care, Hearing Services, Vision Care, Podiatry, Speech Therapy, Nutrition, Pharmacy, and IV Therapy
- **Lucide React Icons**: Replaced Font Awesome with modern Lucide React icons for better performance
- **Organized Categories**: Separated services into Core Medical and Specialized sections
- **Interactive Service Cards**: Added hover effects and animations to service displays

### New Pages Added
- **Services Page**: Comprehensive overview of all medical services with rapid care section
- **How It Works Page**: 5-step process explanation with benefits and FAQ sections  
- **Rapid Services Page**: Dedicated page explaining priority pricing for urgent services
- **About Us Page**: Comprehensive company information with mission, vision, and story
- **Safety & Trust Page**: Provider verification process and security measures  
- **Support Center Page**: FAQ, contact forms, and help categories
- **Optimized Routes**: All menu options now have functional dedicated pages

### Performance Optimizations
- **React Optimization**: Fixed infinite re-rendering issues in provider registration
- **Component Memoization**: Added React.memo and useCallback optimizations throughout
- **Enhanced Caching**: Improved query client configuration with better error handling
- **Framer Motion Integration**: Added smooth animations throughout the application

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