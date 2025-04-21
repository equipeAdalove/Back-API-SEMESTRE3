import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NcmService {
  constructor(private prisma: PrismaService) {}
  //aux_ncm_info
  getInfo(co_ncm: string) {
    return this.prisma.aux_ncm_info.findUnique({ where: { co_ncm } });
  }

  //aux_ncm_ano
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

  // aux_ncm_total
  getTotal(co_ncm: string) {
    return this.prisma.aux_ncm_total.findUnique({ where: { co_ncm } });
  }

  // valor_agregado_ncm
  getValorAgregadoAno(co_ncm: string, ano: number) {
    return this.prisma.aux_valor_agregado_ncm.findUnique({
      where: { co_ncm_ano: { co_ncm, ano } },
    });
  }

  // aux_ncm_total
  getValorAgregadoTotal(co_ncm: string) {
    return this.prisma.aux_ncm_total.findUnique({
      where: { co_ncm },
      select: { co_ncm: true, valor_agregado: true },
    });
  }
}
