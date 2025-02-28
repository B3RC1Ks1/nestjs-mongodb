import { Module } from '@nestjs/common';
import { TasksService } from 'src/tasks/Task.service';
import { TasksController } from 'src/tasks/Task.controller';
import { TasksProcessor } from 'src/tasks/Task.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/schemas/Task.schema';
import { BullModule } from '@nestjs/bull';
import { ReservationModule } from 'src/reservations/Reservation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    BullModule.registerQueue({
      name: 'taskQueue',
    }),
    ReservationModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor],
})
export class TasksModule {}
