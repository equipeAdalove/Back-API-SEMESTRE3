import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [PaisController],
  providers: [PaisService, PrismaService],
})
export class PaisModule {}
