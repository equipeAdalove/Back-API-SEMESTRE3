import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

interface ValorAgregado {
  ano: number;
  exp_va_kg: number;
  imp_va_kg: number;
  exp_va_un: number;
  imp_va_un: number;
  va_diferenca_export_import: number;
}
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

  async findByQueries(
    params: Record<string, string | undefined>,
    page: number,
    limit: number,
  ) {
    const where: any = {};

    for (const key in params) {
      const value = params[key];
      if (!value) continue;

      switch (key) {
        case 'co_ano':
        case 'co_mes':
        case 'co_unid':
        case 'co_pais':
        case 'co_via':
        case 'co_urf':
          where[key] = Number(value);
          break;

        case 'sg_uf_ncm':
        case 'co_ncm':
          where[key] = value;
          break;

        case 'vl_fob_min':
          where.vl_fob = { ...(where.vl_fob || {}), gte: new Decimal(value) };
          break;

        case 'vl_fob_max':
          where.vl_fob = { ...(where.vl_fob || {}), lte: new Decimal(value) };
          break;

        case 'qt_estat_min':
          where.qt_estat = {
            ...(where.qt_estat || {}),
            gte: new Decimal(value),
          };
          break;

        case 'qt_estat_max':
          where.qt_estat = {
            ...(where.qt_estat || {}),
            lte: new Decimal(value),
          };
          break;

        case 'kg_liquido_min':
          where.kg_liquido = {
            ...(where.kg_liquido || {}),
            gte: new Decimal(value),
          };
          break;

        case 'kg_liquido_max':
          where.kg_liquido = {
            ...(where.kg_liquido || {}),
            lte: new Decimal(value),
          };
          break;

        case 'vl_frete_min':
          where.vl_frete = {
            ...(where.vl_frete || {}),
            gte: new Decimal(value),
          };
          break;

        case 'vl_frete_max':
          where.vl_frete = {
            ...(where.vl_frete || {}),
            lte: new Decimal(value),
          };
          break;

        case 'vl_seguro_min':
          where.vl_seguro = {
            ...(where.vl_seguro || {}),
            gte: new Decimal(value),
          };
          break;

        case 'vl_seguro_max':
          where.vl_seguro = {
            ...(where.vl_seguro || {}),
            lte: new Decimal(value),
          };
          break;
      }
    }

    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.exportacao.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.exportacao.count({ where }),
    ]);

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      limit,
    };
  }
  async obterDadosPorAno(uf: string, ano: number) {
    const exportacao = await this.prisma.exportacao.aggregate({
      where: { sg_uf_ncm: uf, co_ano: ano },
      _sum: { vl_fob: true, kg_liquido: true },
    });
    const importacao = await this.prisma.importacao.aggregate({
      where: { sg_uf_ncm: uf, co_ano: ano },
      _sum: { vl_fob: true, kg_liquido: true },
    });
    return {
      ano,
      sg_uf_ncm: uf,
      vl_fob_exp: exportacao._sum.vl_fob || 0,
      vl_fob_imp: importacao._sum.vl_fob || 0,
      kg_liquido_exp: exportacao._sum.kg_liquido || 0,
      kg_liquido_imp: importacao._sum.kg_liquido || 0,
    };
  }

  async obterTotalEstado(uf: string) {
    const exportacao = await this.prisma.exportacao.aggregate({
      where: { sg_uf_ncm: uf },
      _sum: { vl_fob: true, kg_liquido: true },
    });
    const importacao = await this.prisma.importacao.aggregate({
      where: { sg_uf_ncm: uf },
      _sum: { vl_fob: true, kg_liquido: true },
    });
    return {
      sg_uf_ncm: uf,
      vl_fob_exp: exportacao._sum.vl_fob || 0,
      vl_fob_imp: importacao._sum.vl_fob || 0,
      kg_liquido_exp: exportacao._sum.kg_liquido || 0,
      kg_liquido_imp: importacao._sum.kg_liquido || 0,
    };
  }

  async obterValorAgregadoPorUF(uf: string) {
    const resultado: ValorAgregado[] = [];

    for (let ano = 2014; ano <= 2024; ano++) {
      const exp = await this.prisma.exportacao.aggregate({
        where: { sg_uf_ncm: uf, co_ano: ano },
        _sum: { vl_fob: true, kg_liquido: true, co_unid: true },
      });

      const imp = await this.prisma.importacao.aggregate({
        where: { sg_uf_ncm: uf, co_ano: ano },
        _sum: { vl_fob: true, kg_liquido: true, co_unid: true },
      });

      const expFob = Number(exp._sum.vl_fob ?? 0);
      const expKg = Number(exp._sum.kg_liquido ?? 0);
      const expUn = Number(exp._sum.co_unid ?? 0);

      const impFob = Number(imp._sum.vl_fob ?? 0);
      const impKg = Number(imp._sum.kg_liquido ?? 0);
      const impUn = Number(imp._sum.co_unid ?? 0);

      resultado.push({
        ano,
        exp_va_kg: expKg > 0 ? Number((expFob / expKg).toFixed(2)) : 0,
        imp_va_kg: impKg > 0 ? Number((impFob / impKg).toFixed(2)) : 0,
        exp_va_un: expUn > 0 ? Number((expFob / expUn).toFixed(2)) : 0,
        imp_va_un: impUn > 0 ? Number((impFob / impUn).toFixed(2)) : 0,
        va_diferenca_export_import:
          expKg > 0 && impKg > 0
            ? Number((expFob / expKg - impFob / impKg).toFixed(2))
            : 0,
      });
    }

    return resultado;
  }

  async obterRankingProdutos(uf: string, ano: number) {
    const produtos = await this.prisma.exportacao.groupBy({
      by: ['co_ncm'],
      where: { sg_uf_ncm: uf, co_ano: ano },
      _sum: { vl_fob: true },
      orderBy: { _sum: { vl_fob: 'desc' } },
      take: 10,
    });
    return produtos.map((p) => ({ name: p.co_ncm, value: p._sum.vl_fob || 0 }));
  }

  async obterRankingMunicipios(uf: string, ano: number) {
    const municipios = await this.prisma.exportacao.groupBy({
      by: ['co_urf'],
      where: { sg_uf_ncm: uf, co_ano: ano },
      _sum: { vl_fob: true },
      orderBy: { _sum: { vl_fob: 'desc' } },
      take: 10,
    });
    return municipios.map((m) => ({
      name: `URF ${m.co_urf}`,
      value: m._sum.vl_fob || 0,
    }));
  }

  async obterDestinosExportacao(uf: string, ano: number) {
    const filePath = path.join(process.cwd(), 'public', 'csv', 'paises.csv');
    const paisesCSV = fs.readFileSync(filePath, 'utf8');
    const mapaPaises: Record<string, string> = {};

    paisesCSV
      .split('\n')
      .slice(1)
      .forEach((linha) => {
        const [co_pais, , , nome] = linha.split(';');
        if (co_pais && nome)
          mapaPaises[co_pais] = nome.replace(/\"/g, '').trim();
      });

    const destinos = await this.prisma.exportacao.groupBy({
      by: ['co_pais'],
      where: { sg_uf_ncm: uf, co_ano: ano },
      _sum: { vl_fob: true },
    });

    // 🔧 Correção: converter os valores de vl_fob para number antes de usar no sort
    destinos.sort(
      (a, b) => Number(b._sum.vl_fob ?? 0) - Number(a._sum.vl_fob ?? 0),
    );

    const top5 = destinos.slice(0, 5).map((d) => ({
      pais: mapaPaises[d.co_pais] || d.co_pais,
      valor_fob: Number(d._sum.vl_fob ?? 0),
    }));

    // 🔧 Correção: também converte no reduce
    const outros = destinos
      .slice(5)
      .reduce((acc, d) => acc + Number(d._sum.vl_fob ?? 0), 0);

    if (outros > 0) {
      top5.push({ pais: 'Outros', valor_fob: outros });
    }

    return top5;
  }
}
