import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransporteService } from './transporte.service';

@ApiTags('Transporte')
@Controller('transporte')
export class TransporteController {
  constructor(private readonly transporteService: TransporteService) {}

  @Get('exportacao/estado/:uf/ano/:ano')
  getExportacaoEstadoAno(@Param('uf') uf: string, @Param('ano') ano: number) {
    return this.transporteService.getTopVias(
      'exportacao',
      'estado',
      uf.toUpperCase(),
      ano,
    );
  }

  @Get('exportacao/estado/:uf')
  getExportacaoEstado(@Param('uf') uf: string) {
    return this.transporteService.getTopVias('exportacao', 'estado', uf);
  }

  @Get('exportacao/ncm/:ncm/ano/:ano')
  getExportacaoNcmAno(@Param('ncm') ncm: string, @Param('ano') ano: number) {
    return this.transporteService.getTopVias('exportacao', 'ncm', ncm, ano);
  }

  @Get('exportacao/ncm/:ncm')
  getExportacaoNcm(@Param('ncm') ncm: string) {
    return this.transporteService.getTopVias('exportacao', 'ncm', ncm);
  }

  // Importação
  @Get('importacao/estado/:uf/ano/:ano')
  getImportacaoEstadoAno(@Param('uf') uf: string, @Param('ano') ano: number) {
    return this.transporteService.getTopVias('importacao', 'estado', uf, ano);
  }

  @Get('importacao/estado/:uf')
  getImportacaoEstado(@Param('uf') uf: string) {
    return this.transporteService.getTopVias('importacao', 'estado', uf);
  }

  @Get('importacao/ncm/:ncm/ano/:ano')
  getImportacaoNcmAno(@Param('ncm') ncm: string, @Param('ano') ano: number) {
    return this.transporteService.getTopVias('importacao', 'ncm', ncm, ano);
  }

  @Get('importacao/ncm/:ncm')
  getImportacaoNcm(@Param('ncm') ncm: string) {
    return this.transporteService.getTopVias('importacao', 'ncm', ncm);
  }
}
