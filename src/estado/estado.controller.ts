import { Controller, Get, Param } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Estado')
@Controller('estado')
export class EstadoController {
  constructor(private estadoService: EstadoService) {}

  @Get(':uf/ano/:ano')
  @ApiOperation({
    summary: 'Retorna os dados do estado para um determinado ano',
  })
  @ApiParam({
    name: 'uf',
    example: 'SP',
    description: 'Sigla da Unidade Federativa',
  })
  @ApiParam({ name: 'ano', example: '2022', description: 'Ano da consulta' })
  @ApiResponse({ status: 200, description: 'Dados retornados com sucesso' })
  getAno(@Param('uf') uf: string, @Param('ano') ano: string) {
    return this.estadoService.getAno(uf.toUpperCase(), parseInt(ano));
  }

  @Get(':uf/total')
  @ApiOperation({ summary: 'Retorna o total de dados do estado' })
  @ApiParam({
    name: 'uf',
    example: 'SP',
    description: 'Sigla da Unidade Federativa',
  })
  @ApiResponse({ status: 200, description: 'Total retornado com sucesso' })
  getTotal(@Param('uf') uf: string) {
    return this.estadoService.getTotal(uf.toUpperCase());
  }

  @Get(':uf/ncm/:co_ncm/ano/:ano')
  @ApiOperation({
    summary: 'Retorna os dados de NCM para o estado em um ano específico',
  })
  @ApiParam({ name: 'uf', example: 'SP' })
  @ApiParam({ name: 'co_ncm', example: '01012100', description: 'Código NCM' })
  @ApiParam({ name: 'ano', example: '2022' })
  @ApiResponse({
    status: 200,
    description: 'Dados de NCM retornados com sucesso',
  })
  getNcmAno(
    @Param('uf') uf: string,
    @Param('co_ncm') co_ncm: string,
    @Param('ano') ano: string,
  ) {
    return this.estadoService.getNcmAno(
      uf.toUpperCase(),
      co_ncm,
      parseInt(ano),
    );
  }

  @Get(':uf/ncm/:co_ncm/total')
  @ApiOperation({ summary: 'Retorna o total do NCM para o estado' })
  @ApiParam({ name: 'uf', example: 'SP' })
  @ApiParam({ name: 'co_ncm', example: '01012100' })
  @ApiResponse({
    status: 200,
    description: 'Total do NCM retornado com sucesso',
  })
  getNcmTotal(@Param('uf') uf: string, @Param('co_ncm') co_ncm: string) {
    return this.estadoService.getNcmTotal(uf.toUpperCase(), co_ncm);
  }

  @Get(':uf/valor-agregado')
  @ApiOperation({ summary: 'Retorna o valor agregado do estado' })
  @ApiParam({ name: 'uf', example: 'SP' })
  @ApiResponse({
    status: 200,
    description: 'Valor agregado retornado com sucesso',
  })
  getValorAgregado(@Param('uf') uf: string) {
    return this.estadoService.getValorAgregado(uf.toUpperCase());
  }
}
