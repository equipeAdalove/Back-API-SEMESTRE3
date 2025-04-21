import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransporteService } from './transporte.service';

@ApiTags('Transporte')
@Controller('transporte')
export class TransporteController {
  constructor(private readonly transporteService: TransporteService) {}

  @Get('ano/:ano')
  @ApiOperation({
    summary: 'Mostra o uso das diferentes vias de transporte por ano',
    description: `Retorna os dados de exportação e importação agrupados por tipo de transporte (marítimo, rodoviário, aéreo, etc.) para o ano especificado.
`,
  })
  @ApiParam({
    name: 'ano',
    type: Number,
    description: 'Ano desejado (ex: 2018)',
  })
  getPorAno(@Param('ano') ano: number) {
    return this.transporteService.getPorAno(+ano);
  }
}
