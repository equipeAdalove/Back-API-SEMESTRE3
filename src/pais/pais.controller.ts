import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaisService } from './pais.service';

@ApiTags('País')
@Controller('pais')
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @Get('ano/:ano')
  @ApiOperation({
    summary: 'Total negociado com cada país por ano',
    description: `Mostra o valor FOB de exportação e importação por país para o ano especificado.
`,
  })
  @ApiParam({
    name: 'ano',
    type: Number,
    description: 'Ano desejado (ex: 2020)',
  })
  getPorAno(@Param('ano') ano: number) {
    return this.paisService.getPorAno(+ano);
  }

  @Get('total')
  @ApiOperation({
    summary: 'Acumulado total de exportação/importação por país',
    description: `Mostra o total negociado por país ao longo do tempo.`,
  })
  getTotal() {
    return this.paisService.getTotal();
  }
}
