import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  notifyTaskStatus(taskId: string, status: string, errors: any[] = []): void {
    this.server.emit('taskStatusUpdate', { taskId, status, errors });
  }
}
