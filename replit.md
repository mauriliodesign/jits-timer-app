# Timer Application

## Overview

This is a full-stack timer application built with React frontend and Express backend, designed for boxing/workout training sessions. The application provides two distinct interfaces: a mobile control interface for managing timer settings and controls, and a TV display interface for showing the timer during workouts. Real-time synchronization between devices is achieved through WebSocket connections, allowing seamless control and display across multiple devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/UI component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: Custom WebSocket hook for live timer updates

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with real-time WebSocket endpoints
- **Data Storage**: In-memory storage with interface for future database integration
- **Development**: Vite middleware integration for hot reload during development

### Data Storage Solutions
- **Current Implementation**: In-memory storage using Map data structures
- **Database Schema**: Drizzle ORM configured for PostgreSQL with timer session tables
- **Migration Support**: Drizzle Kit for database schema management
- **Future-Ready**: Interface-based storage abstraction allows easy database integration

### Authentication and Authorization
- **Authentication System**: Firebase Authentication with Google Sign-In
- **Protected Routes**: Mobile control interface requires authentication
- **Public Routes**: TV display remains accessible without authentication
- **User Management**: User profile dropdown with logout functionality
- **Session Management**: Firebase handles authentication state and sessions
- **Security**: Only authenticated users can access timer controls

### Real-time Communication
- **WebSocket Server**: Custom WebSocket implementation for timer synchronization
- **Message Types**: Typed message schema using Zod validation
- **Broadcasting**: Server broadcasts timer updates to all connected clients
- **Connection Management**: Automatic reconnection and error handling on client side

### API Structure
- **Timer Management**: 
  - GET `/api/timer/current` - Retrieve current timer session
  - POST `/api/timer/config` - Create/update timer configuration
  - POST `/api/timer/control` - Control timer actions (start/pause/reset)
- **WebSocket Endpoint**: `/ws` for real-time timer updates

### User Interface Design
- **Mobile Control Interface**: Touch-optimized controls for timer configuration and management
- **TV Display Interface**: Large, readable display optimized for viewing from distance
- **Responsive Design**: Tailwind breakpoints ensure compatibility across device sizes
- **Component Architecture**: Modular UI components with consistent design patterns

## External Dependencies

### Authentication Dependencies
- **firebase**: Complete Firebase SDK for authentication and real-time features
- **@radix-ui/react-avatar**: Accessible avatar component for user profiles
- **@radix-ui/react-dropdown-menu**: Accessible dropdown menu for user actions

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity for Neon database
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Schema validation integration between Drizzle and Zod

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility

### State Management and Data Fetching
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers

### Development and Build Tools
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: React integration for Vite
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

### Real-time Communication
- **ws**: WebSocket library for Node.js server implementation
- **Custom WebSocket hooks**: Client-side WebSocket management

### Additional Utilities
- **date-fns**: Date manipulation and formatting
- **zod**: Runtime type validation and schema definition
- **wouter**: Lightweight routing library for React