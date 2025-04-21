import { Controller, Get, Param } from '@nestjs/common';
import { NcmService } from './ncm.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('NCM')
@Controller('ncm')
export class NcmController {
  constructor(private readonly ncmService: NcmService) {}

  @Get(':co_ncm/info')
  @ApiOperation({ summary: 'Retorna informações gerais sobre o NCM' })
  @ApiParam({ name: 'co_ncm', example: '01012100', description: 'Código NCM' })
  @ApiResponse({
    status: 200,
    description: 'Informações do NCM retornadas com sucesso',
  })
  getInfo(@Param('co_ncm') co_ncm: string) {
    return this.ncmService.getInfo(co_ncm);
  }

  @Get(':co_ncm/ano/:ano')
  @ApiOperation({ summary: 'Retorna dados do NCM para um determinado ano' })
  @ApiParam({ name: 'co_ncm', example: '01012100' })
  @ApiParam({ name: 'ano', example: '2022' })
  @ApiResponse({
    status: 200,
    description: 'Dados do NCM por ano retornados com sucesso',
  })
  getPorAno(@Param('co_ncm') co_ncm: string, @Param('ano') ano: string) {
    return this.ncmService.getAno(co_ncm, +ano);
  }

  @Get(':co_ncm/total')
  @ApiOperation({ summary: 'Retorna o total geral do NCM' })
  @ApiParam({ name: 'co_ncm', example: '01012100' })
  @ApiResponse({
    status: 200,
    description: 'Total do NCM retornado com sucesso',
  })
  getTotal(@Param('co_ncm') co_ncm: string) {
    return this.ncmService.getTotal(co_ncm);
  }

  @Get(':co_ncm/valor-agregado')
  @ApiOperation({ summary: 'Retorna o valor agregado total do NCM' })
  @ApiParam({ name: 'co_ncm', example: '01012100' })
  @ApiResponse({
    status: 200,
    description: 'Valor agregado total retornado com sucesso',
  })
  getValorAgregadoTotal(@Param('co_ncm') co_ncm: string) {
    return this.ncmService.getValorAgregadoTotal(co_ncm);
  }

  @Get(':co_ncm/valor-agregado/:ano')
  @ApiOperation({ summary: 'Retorna o valor agregado do NCM por ano' })
  @ApiParam({ name: 'co_ncm', example: '01012100' })
  @ApiParam({ name: 'ano', example: '2022' })
  @ApiResponse({
    status: 200,
    description: 'Valor agregado por ano retornado com sucesso',
  })
  getValorAgregadoAno(
    @Param('co_ncm') co_ncm: string,
    @Param('ano') ano: string,
  ) {
    return this.ncmService.getValorAgregadoAno(co_ncm, +ano);
  }
}
