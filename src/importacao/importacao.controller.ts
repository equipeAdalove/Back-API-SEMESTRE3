import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ImportacaoService } from './importacao.service';

@Controller('importacao')
export class ImportacaoController {
  constructor(private readonly importacaoService: ImportacaoService) {}

  @Get()
  async getAllRegisters(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.importacaoService.findAllRegister(pageNumber, limitNumber);
  }

  @Get('/ncm/:ncm')
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
  getRegisterByQuery(
    @Query() query: Record<string, string | undefined>,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.importacaoService.findByQueries(query, page, limit);
  }
}
