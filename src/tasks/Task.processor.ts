import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { TasksService } from 'src/tasks/Task.service';
import { ReservationService } from 'src/reservations/Reservation.service';

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
    let errorReport: ErrorReportEntry[] = [];
    try {
      await this.tasksService.updateTaskStatus(taskId, 'IN_PROGRESS');
      const workbook = XLSX.readFile(filePath, { cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.reservation_id || !row.guest_name || !row.status) {
          errorReport.push({
            row: i + 2,
            message: 'Brak wymaganych pól',
            suggestion: 'Uzupełnij pola: reservation_id, guest_name, status',
          });
          continue;
        }
        if (
          isNaN(new Date(row.check_in_date).getTime()) ||
          isNaN(new Date(row.check_out_date).getTime())
        ) {
          errorReport.push({
            row: i + 2,
            message: 'Nieprawidłowy format daty',
            suggestion: 'Użyj formatu YYYY-MM-DD',
          });
          continue;
        }

        const status = row.status.toLowerCase();
        if (status === 'anulowana' || status === 'zrealizowana') {
          await this.reservationsService.updateIfExists(row);
        } else {
          await this.reservationsService.addOrUpdate(row);
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
          message: 'Błąd przetwarzania',
          suggestion: err.message,
        },
      ]);
    }
  }
}
