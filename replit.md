# Vibe Tools - Voting Platform

## Overview

This is a full-stack web application built for voting on favorite coding tools. The application uses a modern tech stack with React on the frontend, Express.js on the backend, and PostgreSQL with Drizzle ORM for data persistence. The app features a sleek, gradient-themed UI with tool voting functionality and email collection capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with connect-pg-simple for PostgreSQL session storage
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful API endpoints under `/api` prefix

## Key Components

### Database Schema
The application uses three main database tables:
1. **users**: Stores user information with username and password
2. **tools**: Contains coding tools with names and like counts
3. **user_tool_likes**: Junction table tracking user likes for tools

### Frontend Components
- **HeroSection**: Main landing page with tool voting grid and email signup
- **ToolsGrid**: Interactive grid displaying coding tools with voting functionality
- **Navbar**: Fixed navigation with responsive mobile menu
- **Footer**: Contact information and social links

### Backend Services
- **Storage Layer**: Abstracted database operations with fallback for offline mode
- **Authentication**: Session-based user management with temporary user creation
- **API Routes**: Tool management, user creation, and voting endpoints

## Data Flow

1. **User Registration**: Anonymous users get temporary IDs and usernames
2. **Tool Voting**: Users can like/unlike tools with real-time count updates
3. **Email Collection**: External Google Apps Script integration for email submissions
4. **Session Management**: Express sessions maintain user state across requests

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Comprehensive UI component library
- **drizzle-orm**: Type-safe database ORM
- **express-session**: Session middleware for Express

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and autoprefixing

### External Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Google Apps Script**: Email collection webhook
- **Replit**: Development and hosting platform

## Deployment Strategy

### Development Mode
- Vite dev server with HMR for frontend
- Express server with TypeScript compilation via tsx
- Database migrations handled by Drizzle Kit
- Session storage in PostgreSQL

### Production Build
- Frontend built to `dist/public` directory
- Backend bundled with esbuild for Node.js
- Static file serving from Express
- Environment variables for database connection

### Database Management
- Drizzle migrations in `./migrations` directory
- Schema definition in `shared/schema.ts`
- Push-based deployment with `db:push` command

## Changelog
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.