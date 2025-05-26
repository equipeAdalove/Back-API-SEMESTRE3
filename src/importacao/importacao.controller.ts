import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ImportacaoService } from './importacao.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Importação') // Define o grupo da API no Swagger
@Controller('importacao')
export class ImportacaoController {
  constructor(private readonly importacaoService: ImportacaoService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todos os registros de importação' })
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
    return this.importacaoService.findAllRegister(pageNumber, limitNumber);
  }

  @Get('/ncm/:ncm')
  @ApiOperation({ summary: 'Buscar registros de importação por NCM' })
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
    return this.importacaoService.findByNcm(ncm, pageNumber, limitNumber);
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Buscar registros de importação com filtros personalizados',
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
      'Filtros personalizados para consulta na tabela importacao (pode incluir qualquer campo da tabela)',
    required: false,
  })
  async getRegisterByQuery(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query() query: Record<string, string | undefined>,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    // Remove os parâmetros de paginação da query antes de passar para o service
    const { page: _p, limit: _l, ...filters } = query;

    return this.importacaoService.findByQueries(
      filters,
      pageNumber,
      limitNumber,
    );
  }

  @Get(':uf/ano/:ano/ranking-produtos')
  @ApiOperation({ summary: 'Ranking de produtos importados por UF e ano' })
  getRankingProdutos(
    @Param('uf') uf: string,
    @Param('ano', ParseIntPipe) ano: number,
  ) {
    return this.importacaoService.getRankingProdutos(uf.toUpperCase(), ano);
  }

  @Get(':uf/ano/:ano/paises-origem')
  @ApiOperation({
    summary: 'Principais países de origem das importações por UF e ano',
  })
  getPaisesOrigem(
    @Param('uf') uf: string,
    @Param('ano', ParseIntPipe) ano: number,
  ) {
    return this.importacaoService.getPaisesOrigem(uf.toUpperCase(), ano);
  }

  @Get(':uf/ano/:ano/municipios')
  @ApiOperation({
    summary: 'Municípios de destino que mais importam na UF e ano',
  })
  getMunicipiosDestino(
    @Param('uf') uf: string,
    @Param('ano', ParseIntPipe) ano: number,
  ) {
    return this.importacaoService.getMunicipiosDestino(uf.toUpperCase(), ano);
  }
}
