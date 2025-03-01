import { Module } from '@nestjs/common';
import { TasksService } from 'src/tasks/Task.service';
import { TasksController } from 'src/tasks/Task.controller';
import { TasksProcessor } from 'src/tasks/Task.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/schemas/Task.schema';
import { BullModule } from '@nestjs/bull';
import { ReservationsModule } from 'src/reservations/Reservation.module';
import { TasksGateway } from 'src/tasks/Task.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    BullModule.registerQueue({
      name: 'taskQueue',
    }),
    ReservationsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor, TasksGateway],
  exports: [TasksService, TasksGateway],
})
export class TasksModule {}
