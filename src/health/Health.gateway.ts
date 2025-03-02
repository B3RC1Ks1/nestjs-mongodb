import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class HealthGateway {
  @WebSocketServer()
  server: Server;

  notifyHealthStatus(status: any): void {
    this.server.emit('healthStatusUpdate', { status });
  }
}