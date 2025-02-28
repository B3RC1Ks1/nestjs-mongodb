// src/tasks/tasks.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from 'src/schemas/Task.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectQueue('taskQueue') private taskQueue: Queue,
  ) {}

  async createTask(filePath: string): Promise<string> {
    const task = new this.taskModel({
      filePath,
      status: 'PENDING',
      createdAt: new Date(),
    });
    const savedTask = await task.save();

    await this.taskQueue.add('processFile', {
      taskId: savedTask._id,
      filePath,
    });

    return String(savedTask._id);
  }

  async getTaskStatus(taskId: string): Promise<any> {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) return null;
    return {
      taskId: task._id,
      status: task.status,
      errors: task.errorReport || [],
    };
  }

  async getErrorReport(taskId: string): Promise<Buffer | null> {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task || !task.errorReport) return null;
    let csv = 'Row,Error,Suggestion\n';
    for (const err of task.errorReport) {
      csv += `${err.row},${err.message},${err.suggestion}\n`;
    }
    return Buffer.from(csv);
  }

  async updateTaskStatus(
    taskId: string,
    status: string,
    errorReport: any[] = [],
  ) {
    await this.taskModel.findByIdAndUpdate(taskId, { status, errorReport });
  }
}
