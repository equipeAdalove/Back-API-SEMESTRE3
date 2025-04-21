import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ExportacaoService } from './exportacao.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

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
    example: {
      co_ano: '2023',
      co_mes: '12',
      co_pais: '840',
    },
  })
  getRegisterByQuery(
    @Query() query: Record<string, string | undefined>,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.exportacaoService.findByQueries(query, page, limit);
  }
}
