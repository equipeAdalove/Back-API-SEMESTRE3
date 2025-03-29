import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/database/prisma.module';
import { ExportacaoModule } from 'src/exportacao/exportacao.module';
import { ImportacaoModule } from 'src/importacao/importacao.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ExportacaoModule,
    ImportacaoModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
