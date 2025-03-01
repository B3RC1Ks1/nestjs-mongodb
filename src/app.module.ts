import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { TasksModule } from 'src/tasks/Task.module';
import { ReservationsModule } from './reservations/Reservation.module';
import { HealthModule } from 'src/health/Health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/',
    ),
    BullModule.forRoot({
      redis: {
        host: process.env.BULL_REDIS_HOST || 'localhost',
        port: parseInt(process.env.BULL_REDIS_PORT || '6379', 10),
      },
    }),
    TasksModule,
    ReservationsModule,
    HealthModule,
  ],
})
export class AppModule {}

