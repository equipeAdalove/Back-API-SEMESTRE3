import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { Decimal } from 'decimal.js';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImportacaoService {
  private paisesMap: Record<string, string> = {};
  private ncmMap: Map<string, string> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.carregarPaises();
    this.carregarNCM();
  }

  private carregarNCM() {
    const filePath = path.resolve('public', 'csv', 'NCM.csv');

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');

      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ',', // O seu CSV é separado por vírgula!
        trim: true,
      });

      for (const record of records) {
        const codigo = record.CO_NCM?.trim();
        const nome = record.NO_NCM_POR?.trim();

        if (codigo && nome) {
          this.ncmMap.set(codigo, nome);
        }
      }
    } else {
      console.error('Arquivo NCM.csv não encontrado em public/csv');
    }
  }

  private carregarPaises() {
    const filePath = path.join(process.cwd(), 'public', 'csv', 'paises.csv');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      data.split(/\r?\n/).forEach((linha) => {
        const [codigo, nome] = linha.split(';');
        if (codigo && nome && codigo !== 'CO_PAIS') {
          this.paisesMap[codigo.trim()] = nome.trim();
        }
      });
    }
  }
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
      'vl_frete',
      'vl_seguro',
      // 'vl_fob' REMOVIDO para evitar conflito com min/max
    ];

    for (const key in params) {
      if (camposValidos.includes(key) && params[key] !== undefined) {
        if (key === 'co_ano') {
          if (params[key]?.includes('-')) {
            const [startYear, endYear] = params[key]!.split('-').map(Number);
            where[key] = {
              gte: startYear,
              lte: endYear,
            };
          } else {
            where[key] = Number(params[key]);
          }
        } else if (
          key === 'co_mes' ||
          key === 'co_unid' ||
          key === 'co_pais' ||
          key === 'co_via' ||
          key === 'co_urf'
        ) {
          where[key] = Number(params[key]);
        } else if (
          key === 'qt_estat' ||
          key === 'kg_liquido' ||
          key === 'vl_frete' ||
          key === 'vl_seguro'
        ) {
          where[key] = new Decimal(params[key] || '0');
        } else {
          where[key] = params[key];
        }
      }
    }

    if (params.vl_fob_min || params.vl_fob_max) {
      where.vl_fob = {};
      if (params.vl_fob_min) {
        where.vl_fob.gte = new Decimal(params.vl_fob_min);
      }
      if (params.vl_fob_max) {
        where.vl_fob.lte = new Decimal(params.vl_fob_max);
      }
    }

    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.importacao.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.importacao.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  async getRankingProdutos(uf: string, ano: number) {
    const grupos = await this.prisma.importacao.groupBy({
      by: ['co_ncm'],
      where: { sg_uf_ncm: uf, co_ano: ano },
      _sum: { vl_fob: true },
      orderBy: { _sum: { vl_fob: 'desc' } },
      take: 10,
    });

    return grupos.map((g) => {
      const nome = this.ncmMap.get(g.co_ncm) ?? 'Descrição não encontrada';
      return {
        name: `${g.co_ncm} - ${nome}`,
        value: Number(g._sum.vl_fob ?? 0),
      };
    });
  }

  async getPaisesOrigem(uf: string, ano: number) {
    const grupos = await this.prisma.importacao.groupBy({
      by: ['co_pais'],
      where: { sg_uf_ncm: uf, co_ano: ano },
      _sum: { vl_fob: true },
    });

    grupos.sort(
      (a, b) => Number(b._sum.vl_fob ?? 0) - Number(a._sum.vl_fob ?? 0),
    );

    const top5 = grupos.slice(0, 5);
    const restantes = grupos.slice(5);
    const outros = restantes.reduce(
      (acc, item) => acc + Number(item._sum.vl_fob ?? 0),
      0,
    );

    const resultado = top5.map((item) => ({
      pais: this.paisesMap[item.co_pais.toString()] || item.co_pais.toString(),
      valor_fob: Number(item._sum.vl_fob ?? 0),
    }));

    if (outros > 0) {
      resultado.push({ pais: 'Outros', valor_fob: outros });
    }

    return resultado;
  }

  async getMunicipiosDestino(uf: string, ano: number) {
    const grupos = await this.prisma.importacao.groupBy({
      by: ['co_urf'],
      where: { sg_uf_ncm: uf, co_ano: ano },
      _sum: { vl_fob: true },
      orderBy: { _sum: { vl_fob: 'desc' } },
      take: 10,
    });

    return grupos.map((g) => ({
      municipio: g.co_urf,
      valor_fob: Number(g._sum.vl_fob ?? 0),
    }));
  }
}
