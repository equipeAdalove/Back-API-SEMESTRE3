import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'src/database/prisma.module';
import { EstadoModule } from 'src/estado/estado.module';
import { ExportacaoModule } from 'src/exportacao/exportacao.module';
import { ImportacaoModule } from 'src/importacao/importacao.module';
import { MunicipioModule } from 'src/municipio/municipio.module';
import { NcmModule } from 'src/ncm/ncm.module';
import { PaisModule } from 'src/pais/pais.module';
import { TransporteModule } from 'src/transporte/transporte.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5000,
      isGlobal: true,
    }),
    ConfigModule.forRoot(),
    ExportacaoModule,
    ImportacaoModule,
    NcmModule,
    EstadoModule,
    MunicipioModule,
    PaisModule,
    TransporteModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
