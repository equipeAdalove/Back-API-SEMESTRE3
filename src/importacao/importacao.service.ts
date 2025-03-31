import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { Decimal } from 'decimal.js';

@Injectable()
export class ImportacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllRegister(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const totalRecords = await this.prisma.importacao.count();

    const totalPages = Math.ceil(totalRecords / limit);

    const records = await this.prisma.importacao.findMany({
      skip,
      take: limit,
    });

    return {
      data: records,
      totalRecords,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  // Método para buscar por NCM com paginação
  async findByNcm(ncm: string, page: number, limit: number) {
    return await this.prisma.importacao.findMany({
      where: { co_ncm: ncm },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByQueries(
    params: Record<string, string | undefined>,
    page: number,
    limit: number,
  ) {
    const where: any = {};
    const camposValidos = [
      'co_ano',
      'co_mes',
      'co_ncm',
      'co_unid',
      'co_pais',
      'sg_uf_ncm',
      'co_via',
      'co_urf',
      'qt_estat',
      'kg_liquido',
      'vl_fob',
      'vl_frete',
      'vl_seguro',
    ];

    for (const key in params) {
      if (camposValidos.includes(key) && params[key] !== undefined) {
        if (key === 'co_ano') {
          if (params[key].includes('-')) {
            const [startYear, endYear] = params[key].split('-').map(Number);
            where[key] = {
              gte: startYear,
              lte: endYear,
            };
          } else {
            where[key] = Number(params[key]);
          }
        } else if (key === 'co_mes') {
          where[key] = Number(params[key]);
        } else if (
          key === 'qt_estat' ||
          key === 'kg_liquido' ||
          key === 'vl_fob' ||
          key === 'vl_frete' ||
          key === 'vl_seguro'
        ) {
          where[key] = new Decimal(params[key] || '0');
        } else {
          where[key] = params[key];
        }
      }
    }

    return this.prisma.importacao.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
