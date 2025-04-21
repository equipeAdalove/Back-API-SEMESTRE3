import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import Big from 'big.js';

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

  getNcmAno(uf: string, co_ncm: string, ano: number) {
    return this.prisma.aux_estado_ncm_ano.findUnique({
      where: { ano_sg_uf_ncm_co_ncm: { ano, sg_uf_ncm: uf, co_ncm } },
    });
  }

  getNcmTotal(uf: string, co_ncm: string) {
    return this.prisma.aux_estado_ncm_total.findUnique({
      where: { sg_uf_ncm_co_ncm: { sg_uf_ncm: uf, co_ncm } },
    });
  }

  getValorAgregado(uf: string) {
    return this.prisma.aux_valor_agregado_uf.findUnique({
      where: { uf },
    });
  }
}
