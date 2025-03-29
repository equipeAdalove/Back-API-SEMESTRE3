import { Module } from '@nestjs/common';
import { ExportacaoController } from './exportacao.controller';
import { ExportacaoService } from './exportacao.service';
import { PrismaService } from 'src/database/prisma.service'; // Caso precise

@Module({
  imports: [],
  controllers: [ExportacaoController],
  providers: [ExportacaoService, PrismaService],
})
export class ExportacaoModule {}
