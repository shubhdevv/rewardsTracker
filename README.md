# Rewards API - NestJS + MongoDB

A comprehensive backend API for managing user rewards, transactions, and redemption functionality built with NestJS and MongoDB.

## Features

- **User Management**: Mock user data with no authentication required
- **Rewards Management**: Complete CRUD operations for reward points
- **Transaction Tracking**: Paginated transaction history
- **Redemption System**: Point redemption with validation
- **Data Validation**: Input validation using class-validator
- **Error Handling**: Standardized error responses
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing**: Comprehensive unit tests with Jest

## API Endpoints

### Rewards Management

- `GET /rewards/points?userId={userId}` - Get total reward points for a user
- `GET /rewards/transactions?userId={userId}&page={page}&limit={limit}` - Get paginated transaction history
- `POST /rewards/redeem` - Redeem reward points
- `GET /rewards/options` - Get available reward options

## Database Schema

### Collections

1. **Users Collection**
   - `_id`: MongoDB ObjectId
   - `name`: String (required)
   - `email`: String (required, unique)
   - `createdAt`: Date
   - `updatedAt`: Date

2. **Rewards Collection**
   - `_id`: MongoDB ObjectId
   - `userId`: String (required)
   - `totalPoints`: Number (default: 0)
   - `updatedAt`: Date
   - `createdAt`: Date

3. **Transactions Collection**
   - `_id`: MongoDB ObjectId
   - `userId`: String (required)
   - `amount`: Number (required)
   - `category`: String (required)
   - `pointsEarned`: Number (required)
   - `timestamp`: Date
   - `createdAt`: Date
   - `updatedAt`: Date

4. **Redemptions Collection**
   - `_id`: MongoDB ObjectId
   - `userId`: String (required)
   - `pointsRedeemed`: Number (required)
   - `rewardType`: String (required)
   - `timestamp`: Date
   - `createdAt`: Date
   - `updatedAt`: Date

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewards-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rewards-api
   PORT=8000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For macOS with Homebrew
   brew services start mongodb-community

   # For Ubuntu/Debian
   sudo systemctl start mongod

   # For Windows
   net start MongoDB
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Access the API**
   - API Base URL: `http://localhost:8000`
   - Swagger Documentation: `http://localhost:8000/api-docs`

## Sample API Requests

### Get Total Points
```bash
curl -X GET "http://localhost:8000/rewards/points?userId=507f1f77bcf86cd799439011"
