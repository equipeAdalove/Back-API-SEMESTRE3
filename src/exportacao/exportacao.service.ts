import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ExportacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllRegister(page: number, limit: number) {
    // Calculando o "skip" para a paginação (quantos registros pular)
    const skip = (page - 1) * limit;

    // Contando o total de registros
    const totalRecords = await this.prisma.exportacao.count();

    // Calculando o total de páginas
    const totalPages = Math.ceil(totalRecords / limit);

    const records = await this.prisma.exportacao.findMany({
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
    return await this.prisma.exportacao.findMany({
      where: { co_ncm: ncm },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  // Método de busca filtrada com paginação
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
          key === 'vl_fob'
        ) {
          where[key] = new Decimal(params[key] || '0');
        } else {
          where[key] = params[key];
        }
      }
    }

    return this.prisma.exportacao.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
