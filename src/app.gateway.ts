import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from './prisma/prisma.service';

@WebSocketGateway(4321)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    this.server.emit('room', client.id + ' joined');
  }

  handleDisconnect(client: Socket): void {
    this.server.emit('room', client.id + ' left');
  }

  @SubscribeMessage('changeCell')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('create')
    createData?: any,
    @MessageBody('update')
    updateData?: any,
  ): Promise<void> {
    console.log(updateData);
    let cell;
    if (createData) {
      cell = await this.prisma.cell.create({
        data: createData,
      });
    }
    if (updateData) {
      cell = await this.prisma.cell.update({
        where: { id: updateData.id },
        data: {
          value: updateData.value,
        },
      });
    }
    this.server.emit('room', `[${client.id}] -> ${{ ...cell }}`);
  }
}
