import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

function formatBigNumber(value: unknown, decimals = 2): number | null {
  try {
    if (value === null || value === undefined) return null;

    if (typeof value === 'number' || typeof value === 'string') {
      const num = parseFloat(value.toString());
      return isFinite(num) ? parseFloat(num.toFixed(decimals)) : null;
    }

    if (typeof value === 'object' && value !== null && 'toNumber' in value) {
      const num = (value as Decimal).toNumber();
      return isFinite(num) ? parseFloat(num.toFixed(decimals)) : null;
    }

    return null;
  } catch {
    return null;
  }
}

@Injectable()
export class EstadoService {
  constructor(private prisma: PrismaService) {}

  getAno(uf: string, ano: number) {
    return this.prisma.aux_estado_ano.findUnique({
      where: { ano_sg_uf_ncm: { ano, sg_uf_ncm: uf } },
    });
  }

  getTotal(uf: string) {
    return this.prisma.aux_estado_total.findUnique({
      where: { sg_uf_ncm: uf },
    });
  }

  async getNcmAno(uf: string, co_ncm: string, ano: number) {
    const data = await this.prisma.aux_estado_ncm_ano.findUnique({
      where: { ano_sg_uf_ncm_co_ncm: { ano, sg_uf_ncm: uf, co_ncm } },
    });

    if (!data) return null;

    return {
      ...data,
      vl_fob_exp: formatBigNumber(data.vl_fob_exp),
      vl_fob_imp: formatBigNumber(data.vl_fob_imp),
      kg_liquido_exp: formatBigNumber(data.kg_liquido_exp),
      kg_liquido_imp: formatBigNumber(data.kg_liquido_imp),
    };
  }

  async getNcmTotal(uf: string, co_ncm: string) {
    const data = await this.prisma.aux_estado_ncm_total.findUnique({
      where: { sg_uf_ncm_co_ncm: { sg_uf_ncm: uf, co_ncm } },
    });

    if (!data) return null;

    return {
      ...data,
      vl_fob_exp: formatBigNumber(data.vl_fob_exp),
      vl_fob_imp: formatBigNumber(data.vl_fob_imp),
      kg_liquido_exp: formatBigNumber(data.kg_liquido_exp),
      kg_liquido_imp: formatBigNumber(data.kg_liquido_imp),
    };
  }

  async getValorAgregado(uf: string) {
    const raw = await this.prisma.aux_valor_agregado_uf.findUnique({
      where: { uf },
    });

    if (!raw) return null;

    const resultado: any = {};

    for (const [tipo, valores] of Object.entries(raw)) {
      if (tipo === 'uf') {
        resultado.uf = valores;
        continue;
      }

      if (
        typeof valores === 'object' &&
        valores !== null &&
        !Array.isArray(valores)
      ) {
        resultado[tipo] = {};
        for (const [ano, valor] of Object.entries(valores)) {
          resultado[tipo][ano] = formatBigNumber(valor);
        }
      } else {
        resultado[tipo] = formatBigNumber(valores);
      }
    }

    return resultado;
  }
}
