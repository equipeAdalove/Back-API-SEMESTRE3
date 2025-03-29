import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ExportacaoService } from './exportacao.service';

@Controller('exportacao')
export class ExportacaoController {
  constructor(private readonly exportacaoService: ExportacaoService) {}

  @Get()
  async getAllRegisters(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.exportacaoService.findAllRegister(pageNumber, limitNumber);
  }

  @Get('/ncm/:ncm')
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
  getRegisterByQuery(
    @Query() query: Record<string, string | undefined>,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.exportacaoService.findByQueries(query, page, limit);
  }
}
