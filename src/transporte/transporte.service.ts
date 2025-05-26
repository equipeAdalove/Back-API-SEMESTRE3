import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class TransporteService {
  private viaMap = new Map<number, string>();

  constructor(private prisma: PrismaService) {
    this.carregarVias();
  }

  // Carrega os nomes das vias a partir do CSV na inicialização
  private carregarVias() {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'csv',
      'VIA.csv',
    );
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const codigo = Number(row.CO_VIA);
        const nome = row.NO_VIA?.trim();
        if (!isNaN(codigo) && nome) {
          this.viaMap.set(codigo, nome);
        }
      });
  }

  // Retorna o nome da via baseado no código
  private getViaNome(codigo: number): string {
    return this.viaMap.get(codigo) || 'Desconhecida';
  }

  // Método principal reutilizável para exportação e importação
  async getTopVias(
    tipo: 'exportacao' | 'importacao',
    filtro: 'estado' | 'ncm',
    valor: string,
    ano?: string | number,
  ) {
    const where: any = {};

    if (filtro === 'estado') {
      where.sg_uf_ncm = valor.toUpperCase(); // <- normaliza estado
    } else if (filtro === 'ncm') {
      where.co_ncm = valor;
    }

    // Converte ano para número se for string
    if (ano !== undefined) {
      const anoConvertido = typeof ano === 'string' ? parseInt(ano) : ano;
      if (!isNaN(anoConvertido)) {
        where.co_ano = anoConvertido;
      }
    }

    if (tipo === 'exportacao') {
      const result = await this.prisma.exportacao.groupBy({
        by: ['co_via'],
        where,
        _sum: { vl_fob: true },
        orderBy: [{ _sum: { vl_fob: 'desc' } }],
      });

      return result.map((item) => ({
        co_via: item.co_via,
        no_via: this.getViaNome(item.co_via),
        vl_fob: item._sum.vl_fob,
      }));
    }

    if (tipo === 'importacao') {
      const result = await this.prisma.importacao.groupBy({
        by: ['co_via'],
        where,
        _sum: { vl_fob: true },
        orderBy: [{ _sum: { vl_fob: 'desc' } }],
      });

      return result.map((item) => ({
        co_via: item.co_via,
        no_via: this.getViaNome(item.co_via),
        vl_fob: item._sum.vl_fob,
      }));
    }

    return []; // fallback
  }
}
