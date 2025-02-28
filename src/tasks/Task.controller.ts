import { Controller, Post, Get, Param, UploadedFile, UseInterceptors, HttpException, HttpStatus, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TasksService } from 'src/tasks/Task.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
          return cb(
            new HttpException(
              'Only XLSX files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    // Create a task, add to DB and queue for processing
    const taskId = await this.tasksService.createTask(file.path);
    return { taskId };
  }

  @Get('status/:taskId')
  async getStatus(@Param('taskId') taskId: string) {
    const taskStatus = await this.tasksService.getTaskStatus(taskId);
    if (!taskStatus) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return taskStatus;
  }

  @Get('report/:taskId')
  async downloadReport(@Param('taskId') taskId: string, @Res() res) {
    const reportBuffer = await this.tasksService.getErrorReport(taskId);
    if (!reportBuffer) {
      throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
    }
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="report-${taskId}.csv"`,
    });
    return res.send(reportBuffer);
  }
}
