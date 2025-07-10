import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/rewards-api',
      {
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        family: 4, // Use IPv4, skip trying IPv6
      }
    ),
  ],
})
export class DatabaseModule {}
