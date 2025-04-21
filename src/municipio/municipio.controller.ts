import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MunicipioService } from './municipio.service';
import { ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';

@ApiTags('Município')
@Controller('municipio')
export class MunicipioController {
  constructor(private readonly municipioService: MunicipioService) {}

  @Get('nome/:nome')
  @ApiOperation({ summary: 'Buscar município por nome' })
  @ApiParam({ name: 'nome', description: 'Nome do município' })
  async getMunicipioByNome(@Param('nome') nome: string) {
    return this.municipioService.getMunicipioByNome(nome);
  }

  @Get(':coMunGeo')
  @ApiOperation({
    summary: 'Buscar informações de um município pelo código geográfico',
  })
  @ApiParam({
    name: 'coMunGeo',
    description: 'Código geográfico do município (IBGE)',
    example: '3449904', // Exemplo de São José dos Campos
  })
  async getMunicipioById(@Param('coMunGeo') coMunGeo: string) {
    return this.municipioService.getMunicipioById(coMunGeo);
  }

  // Rota GET para buscar dados SH4 por município e ano
  @Get(':co_mun/ano/:ano')
  @ApiOperation({ summary: 'Dados SH4 por município e ano' })
  @ApiParam({
    name: 'co_mun',
    description: 'Código do município (IBGE)',
    example: '3449904', // Exemplo de São José dos Campos
  })
  @ApiParam({
    name: 'ano',
    description: 'Ano dos dados',
    example: 2023, // Exemplo de ano
  })
  async getMunicipioAno(
    @Param('co_mun') coMun: string,
    @Param('ano', ParseIntPipe) ano: number,
  ) {
    const data = await this.municipioService.getMunicipioAno(coMun, ano);

    // Se não encontrar dados, retorna um array vazio ou um erro
    if (data.length === 0) {
      return { message: 'Nenhum dado encontrado para esse município e ano.' };
    }

    return data;
  }

  // Rota GET para buscar total SH4 agregado por município
  @Get(':co_mun/total')
  @ApiOperation({ summary: 'Total SH4 agregado por município' })
  @ApiParam({
    name: 'co_mun',
    description: 'Código do município (IBGE)',
    example: '3449904',
  })
  async getMunicipioTotal(@Param('co_mun') coMun: string) {
    const data = await this.municipioService.getMunicipioTotal(coMun);

    if (data.length === 0) {
      return { message: 'Nenhum dado encontrado para esse município.' };
    }

    return data;
  }
}
