import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TransporteService {
  constructor(private prisma: PrismaService) {}

  async getPorAno(ano: number) {
    return this.prisma.aux_via_transporte_ano.findMany({
      where: { ano },
      orderBy: { vl_fob_exp: 'desc' },
    });
  }
}
