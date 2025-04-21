import { Module } from '@nestjs/common';
import { TransporteController } from './transporte.controller';
import { TransporteService } from './transporte.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [TransporteController],
  providers: [TransporteService, PrismaService],
})
export class TransporteModule {}
