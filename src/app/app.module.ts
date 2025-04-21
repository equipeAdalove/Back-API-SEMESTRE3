import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
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
  providers: [],
})
export class AppModule {}
