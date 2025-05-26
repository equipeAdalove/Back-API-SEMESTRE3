import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ExportacaoService } from './exportacao.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

interface ValorAgregado {
  ano: number;
  exp_va_kg: number;
  imp_va_kg: number;
  exp_va_un: number;
  imp_va_un: number;
  va_diferenca_export_import: number;
}

@ApiTags('Exportação') // Define o grupo da API no Swagger
@Controller('exportacao')
export class ExportacaoController {
  constructor(private readonly exportacaoService: ExportacaoService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todos os registros de exportação' })
  @ApiQuery({
    name: 'page',
    description: 'Número da página para paginação (padrão é 1)',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limite de registros por página (padrão é 10)',
    required: false,
    example: 10,
  })
  async getAllRegisters(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.exportacaoService.findAllRegister(pageNumber, limitNumber);
  }

  @Get('/ncm/:ncm')
  @ApiOperation({ summary: 'Buscar registros de exportação por NCM' })
  @ApiParam({
    name: 'ncm',
    description: 'Código NCM (Nomenclatura Comum do Mercosul)',
    example: '01012100', // Exemplo de código NCM
  })
  @ApiQuery({
    name: 'page',
    description: 'Número da página para paginação (padrão é 1)',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limite de registros por página (padrão é 10)',
    required: false,
    example: 10,
  })
  getRegisterByNCM(
    @Param('ncm') ncm: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.exportacaoService.findByNcm(ncm, pageNumber, limitNumber);
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Buscar registros de exportação com filtros personalizados',
  })
  @ApiQuery({
    name: 'page',
    description: 'Número da página para paginação (padrão é 1)',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limite de registros por página (padrão é 10)',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'query',
    description:
      'Filtros personalizados para consulta na tabela exportacao (pode incluir qualquer campo da tabela)',
    required: false,
  })
  async getRegisterByQuery(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query() query: Record<string, string | undefined>,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const { page: _p, limit: _l, ...filters } = query;

    return this.exportacaoService.findByQueries(
      filters,
      pageNumber,
      limitNumber,
    );
  }

  @Get(':uf/ano/:ano')
  @ApiOperation({
    summary: 'Obter dados de exportação/importação por ano e estado',
  })
  getDadosAno(@Param('uf') uf: string, @Param('ano') ano: string) {
    return this.exportacaoService.obterDadosPorAno(
      uf.toUpperCase(),
      parseInt(ano),
    );
  }

  @Get(':uf/total')
  @ApiOperation({
    summary:
      'Obter dados totais acumulados de exportação/importação por estado',
  })
  getTotalEstado(@Param('uf') uf: string) {
    return this.exportacaoService.obterTotalEstado(uf.toUpperCase());
  }

  @Get(':uf/valor-agregado')
  @ApiOperation({ summary: 'Obter valor agregado (VA) por ano para um estado' })
  getValorAgregado(@Param('uf') uf: string): Promise<ValorAgregado[]> {
    return this.exportacaoService.obterValorAgregadoPorUF(uf.toUpperCase());
  }

  @Get(':uf/ano/:ano/ranking-produtos')
  @ApiOperation({
    summary: 'Obter ranking de produtos exportados para UF e ano',
  })
  getRankingProdutos(@Param('uf') uf: string, @Param('ano') ano: string) {
    return this.exportacaoService.obterRankingProdutos(
      uf.toUpperCase(),
      parseInt(ano),
    );
  }

  @Get(':uf/ano/:ano/ranking-municipios')
  @ApiOperation({
    summary: 'Obter ranking de municípios exportadores para UF e ano',
  })
  getRankingMunicipios(@Param('uf') uf: string, @Param('ano') ano: string) {
    return this.exportacaoService.obterRankingMunicipios(
      uf.toUpperCase(),
      parseInt(ano),
    );
  }

  @Get(':uf/ano/:ano/destinos')
  @ApiOperation({
    summary: 'Obter distribuição por país de destino para UF e ano',
  })
  getDestinos(@Param('uf') uf: string, @Param('ano') ano: string) {
    return this.exportacaoService.obterDestinosExportacao(
      uf.toUpperCase(),
      parseInt(ano),
    );
  }
}
