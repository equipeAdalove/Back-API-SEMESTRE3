import { Module } from '@nestjs/common';
import { NcmService } from './ncm.service';
import { NcmController } from './ncm.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NcmController],
  providers: [NcmService],
})
export class NcmModule {}
