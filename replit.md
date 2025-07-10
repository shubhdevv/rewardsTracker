# Rewards API - NestJS + MongoDB

## Overview

This is a comprehensive backend API for managing user rewards, transactions, and redemption functionality built with NestJS and MongoDB. The system provides endpoints for tracking user reward points, transaction history, and point redemption capabilities without requiring user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: NestJS (Node.js framework) with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Architecture Pattern**: Modular architecture with separate modules for different business domains
- **API Documentation**: Swagger/OpenAPI integration for automatic documentation
- **Validation**: Class-validator for input validation and transformation
- **Error Handling**: Global exception filter for standardized error responses

### Key Design Decisions
- **No Authentication**: Mock user system for simplified testing and development
- **Modular Structure**: Separate modules for Users, Rewards, Database, and Seeding
- **Data Validation**: Input validation using DTOs (Data Transfer Objects) with class-validator
- **Global Error Handling**: Centralized error handling with custom exception filter
- **Auto-Seeding**: Automatic database seeding on application startup

## Key Components

### 1. Users Module (`src/users/`)
- **Purpose**: Manages user data and validation
- **Schema**: User collection with name, email fields
- **Service**: Provides user existence validation and CRUD operations
- **Note**: Uses mock data, no authentication implemented

### 2. Rewards Module (`src/rewards/`)
- **Purpose**: Core business logic for rewards management
- **Controllers**: RESTful endpoints for points, transactions, and redemptions
- **Services**: Business logic for point calculations and validations
- **Schemas**: Three MongoDB collections (Rewards, Transactions, Redemptions)

### 3. Database Module (`src/database/`)
- **Purpose**: MongoDB connection configuration
- **Connection**: Uses Mongoose with connection string from environment variables
- **Default**: Falls back to local MongoDB instance if no URI provided

### 4. Seed Module (`src/seed/`)
- **Purpose**: Populates database with initial test data
- **Execution**: Runs automatically on application startup
- **Data**: Creates mock users, rewards, and sample transactions

### 5. Common Module (`src/common/`)
- **Filters**: Global HTTP exception filter for standardized error responses
- **Decorators**: API response decorators for Swagger documentation

## Data Flow

### Database Collections

1. **Users Collection**
   - Stores basic user information (name, email)
   - Used for user existence validation
   - Automatically created with seed data

2. **Rewards Collection**
   - Tracks total points per user
   - One record per user with current point balance
   - Updated when points are earned or redeemed

3. **Transactions Collection**
   - Historical record of all point-earning activities
   - Supports pagination for transaction history
   - Indexed for efficient querying by user and timestamp

4. **Redemptions Collection**
   - Records all point redemption activities
   - Tracks what rewards were redeemed and when
   - Links to specific reward types

### API Endpoints

1. **GET /rewards/points?userId={userId}**
   - Returns total reward points for a user
   - Validates user existence before returning data

2. **GET /rewards/transactions?userId={userId}&page={page}&limit={limit}**
   - Returns paginated transaction history
   - Supports pagination with default 5 items per page

3. **POST /rewards/redeem**
   - Processes point redemption requests
   - Validates sufficient points and updates balances
   - Creates redemption record

4. **GET /rewards/options**
   - Returns available reward redemption options
   - Static list of available rewards (cashback, vouchers, etc.)

## External Dependencies

### Core Dependencies
- **@nestjs/core**: NestJS framework core
- **@nestjs/mongoose**: MongoDB integration for NestJS
- **mongoose**: MongoDB object modeling library
- **@nestjs/swagger**: API documentation generation
- **class-validator**: Input validation and transformation
- **class-transformer**: Object transformation utilities

### Development Dependencies
- **jest**: Testing framework
- **ts-jest**: TypeScript support for Jest
- **nodemon**: Development server with hot reloading
- **typescript**: TypeScript language support

### Database Requirements
- **MongoDB**: Document database for data storage
- **Connection**: Configurable via MONGODB_URI environment variable
- **Default**: mongodb://localhost:27017/rewards-api

## Deployment Strategy

### Configuration
- **Port**: Application runs on port 8000
- **Host**: Binds to 0.0.0.0 for container compatibility
- **CORS**: Enabled for cross-origin requests
- **Environment**: Uses environment variables for configuration

### Key Features
- **Auto-seeding**: Database automatically populated with test data
- **Documentation**: Swagger UI available at /api-docs endpoint
- **Health**: Application logs startup status and available endpoints
- **Error Handling**: Global exception filter provides consistent error responses

### Environment Variables
- `MONGODB_URI`: MongoDB connection string (optional, defaults to local instance)
- Other configuration can be added as needed

### API Documentation
- **Swagger UI**: Available at http://localhost:8000/api-docs
- **OpenAPI**: Automatically generated from code annotations
- **Interactive**: Allows testing endpoints directly from documentation

The application is designed to be lightweight and easy to deploy, with minimal external dependencies and automatic data seeding for quick testing and development.