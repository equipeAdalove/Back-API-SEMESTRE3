import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PaisService {
  constructor(private prisma: PrismaService) {}

  async getPorAno(ano: number) {
    return this.prisma.aux_pais_parceiro_ano.findMany({
      where: { ano },
      orderBy: { vl_fob_exp: 'desc' },
    });
  }

  async getTotal() {
    return this.prisma.aux_pais_parceiro_total.findMany({
      orderBy: { vl_fob_exp: 'desc' },
    });
  }
}
