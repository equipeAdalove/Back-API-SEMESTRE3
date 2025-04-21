import { Module } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [EstadoController],
  providers: [EstadoService, PrismaService],
})
export class EstadoModule {}
