import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MunicipioService {
  constructor(private readonly prisma: PrismaService) {}

  async getMunicipioById(coMunGeo: string) {
    return this.prisma.municipios.findUnique({
      where: {
        co_mun_geo: coMunGeo, // A chave primária é 'co_mun_geo'
      },
    });
  }

  async getMunicipioAno(coMun: string, ano: number) {
    // Filtrando por município e ano, além de ordenar pelo código SH4
    const result = await this.prisma.aux_municipio_sh4_ano.findMany({
      where: {
        co_mun: coMun,
        ano: ano,
      },
      orderBy: {
        sh4: 'asc', // Ordenando por SH4 (se necessário)
      },
    });

    // Se não encontrar nenhum dado, retorna um array vazio
    if (result.length === 0) {
      return []; // Retorna um array vazio quando não há resultados
    }

    return result;
  }

  async getMunicipioTotal(coMun: string) {
    // Buscando os dados agrupados por SH4
    const result = await this.prisma.aux_municipio_sh4_total.findMany({
      where: {
        municipio: coMun,
      },
    });

    // Se não encontrar nenhum dado, retorna um array vazio
    if (result.length === 0) {
      return []; // Retorna um array vazio quando não há resultados
    }

    // Agrupando por SH4 e somando os totais de exportação e importação
    const groupedResult = result.map((item) => ({
      sh4: item.sh4,
      vl_fob_exp: item.vl_fob_exp || 0,
      vl_fob_imp: item.vl_fob_imp || 0,
      kg_liquido_exp: item.kg_liquido_exp || 0,
      kg_liquido_imp: item.kg_liquido_imp || 0,
    }));

    return groupedResult;
  }

  async getMunicipioByNome(nome: string) {
    // Normalizando: removendo acentos e deixando em MAIÚSCULAS
    const normalizado = this.normalizeString(nome);

    return this.prisma.municipios.findFirst({
      where: {
        no_mun: {
          equals: normalizado,
          mode: 'insensitive', // Ignora caixa alta/baixa
        },
      },
    });
  }

  // Utilitário para normalizar string
  private normalizeString(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }
}
