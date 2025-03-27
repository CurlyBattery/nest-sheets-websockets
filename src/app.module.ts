import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [PrismaModule],
  providers: [AppGateway],
})
export class AppModule {}
