import { Module } from '@nestjs/common';
import { MunicipioController } from './municipio.controller';
import { MunicipioService } from './municipio.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [MunicipioController],
  providers: [MunicipioService, PrismaService],
})
export class MunicipioModule {}
