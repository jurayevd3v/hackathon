import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket.io',
})
export class FineGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinDispatcher')
  async handleJoinLocation(client: Socket, dispatcher_id: string) {
    await client.join(`dispatcher_${dispatcher_id}`);
    console.log(
      `✅ Client ${client.id} joined room: dispatcher_${dispatcher_id}`,
    );
  }

  broadcastUpdate(dispatcher_id: string, fine_id: string) {
    this.server.to(`dispatcher_${dispatcher_id}`).emit('newFine', {
      message: 'New accident',
      dispatcher_id,
      fine_id,
    });
  }
}
