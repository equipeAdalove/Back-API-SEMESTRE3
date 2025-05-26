import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class NcmService {
  private mapaNCM: Map<string, string> = new Map();

  constructor(private prisma: PrismaService) {
    this.carregarDescricaoNCM();
  }

  private carregarDescricaoNCM() {
    const filePath = path.join(process.cwd(), 'public', 'csv', 'NCM.csv');

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))
      .on('data', (row) => {
        const codigo = row.CO_NCM?.trim();
        const nome = row.NO_NCM_POR?.trim();
        if (codigo && nome) {
          this.mapaNCM.set(codigo, nome);
        }
      })
      .on('end', () => {
        console.log('Arquivo NCM.csv carregado com sucesso.');
      });
  }

  getNomeNcmPorCodigo(co_ncm: string): string {
    const descricao = this.mapaNCM.get(co_ncm);
    if (!descricao) {
      throw new NotFoundException(
        `Descrição para o NCM ${co_ncm} não encontrada.`,
      );
    }
    return descricao;
  }

  // ───────────────────────────────
  // Prisma – Métodos existentes
  // ───────────────────────────────

  getInfo(co_ncm: string) {
    return this.prisma.aux_ncm_info.findUnique({ where: { co_ncm } });
  }

  getAno(co_ncm: string, ano: number) {
    return this.prisma.aux_ncm_ano.findUnique({
      where: {
        ano_co_ncm: {
          ano,
          co_ncm,
        },
      },
    });
  }

  getTotal(co_ncm: string) {
    return this.prisma.aux_ncm_total.findUnique({ where: { co_ncm } });
  }

  getValorAgregadoAno(co_ncm: string, ano: number) {
    return this.prisma.aux_valor_agregado_ncm.findUnique({
      where: { co_ncm_ano: { co_ncm, ano } },
    });
  }

  getValorAgregadoTotal(co_ncm: string) {
    return this.prisma.aux_ncm_total.findUnique({
      where: { co_ncm },
      select: { co_ncm: true, valor_agregado: true },
    });
  }
}
