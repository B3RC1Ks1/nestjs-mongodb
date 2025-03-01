import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TasksService } from 'src/tasks/Task.service';
import { ReservationService } from 'src/reservations/Reservation.service';
import { ReservationDto } from 'src/reservations/Reservation.dto';

interface ErrorReportEntry {
  row: number;
  message: string;
  suggestion: string;
}

@Processor('taskQueue')
export class TasksProcessor {
  private readonly logger = new Logger(TasksProcessor.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly reservationsService: ReservationService,
  ) {}

  @Process('processFile')
  async handleFileProcessing(job: Job<{ taskId: string; filePath: string }>) {
    const { taskId, filePath } = job.data;
    const errorReport: ErrorReportEntry[] = [];
    try {
      await this.tasksService.updateTaskStatus(taskId, 'IN_PROGRESS');

      const workbook = new ExcelJS.Workbook();
      const stream = fs.createReadStream(filePath);
      await workbook.xlsx.read(stream);

      const worksheet = workbook.worksheets[0];
      for (let rowNum = 2; rowNum <= worksheet.rowCount; rowNum++) {
        const row = worksheet.getRow(rowNum);

        let reservationId = '';
        if (row.getCell(1).value) {
          reservationId = row.getCell(1).toString();
        } else {
          reservationId = '';
        }

        let guestName = '';
        if (row.getCell(2).value) {
          guestName = row.getCell(2).toString();
        } else {
          guestName = '';
        }

        let status = '';
        if (row.getCell(3).value) {
          status = row.getCell(3).toString().toLowerCase();
        } else {
          status = '';
        }

        const checkInDate = row.getCell(4).value;
        const checkOutDate = row.getCell(5).value;

        const rowData = {
          reservation_id: reservationId,
          guest_name: guestName,
          status: status,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
        };

        const reservationDto = plainToInstance(ReservationDto, rowData);
        const errors = await validate(reservationDto);
        if (errors.length > 0) {
          const errorMessages = errors
            .map((err) => {
              let messages = '';
              if (err.constraints) {
                messages = Object.values(err.constraints).join(', ');
              }
              return messages;
            })
            .join('; ');
          errorReport.push({
            row: rowNum,
            message: 'Validation failed: ' + errorMessages,
            suggestion: 'Please check the data format.',
          });
          continue;
        }

        if (
          reservationDto.status === 'anulowana' ||
          reservationDto.status === 'zrealizowana'
        ) {
          await this.reservationsService.updateIfExists(reservationDto);
        } else {
          await this.reservationsService.addOrUpdate(reservationDto);
        }
      }
      await this.tasksService.updateTaskStatus(
        taskId,
        errorReport.length ? 'FAILED' : 'COMPLETED',
        errorReport,
      );
    } catch (err) {
      this.logger.error(`Error processing file for task ${taskId}`, err.stack);
      await this.tasksService.updateTaskStatus(taskId, 'FAILED', [
        {
          row: 0,
          message: 'Processing error',
          suggestion: err.message,
        },
      ]);
    }
  }
}
