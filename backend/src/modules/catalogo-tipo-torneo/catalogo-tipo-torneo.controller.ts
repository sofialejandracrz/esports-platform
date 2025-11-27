import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogoTipoTorneoService } from './catalogo-tipo-torneo.service';
import { CreateCatalogoTipoTorneoDto } from './dto/create-catalogo-tipo-torneo.dto';
import { UpdateCatalogoTipoTorneoDto } from './dto/update-catalogo-tipo-torneo.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('catalogos')
@Controller('catalogo-tipo-torneo')
export class CatalogoTipoTorneoController {
  constructor(private readonly catalogoTipoTorneoService: CatalogoTipoTorneoService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo tipo de torneo (admin)' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCatalogoTipoTorneoDto: CreateCatalogoTipoTorneoDto) {
    return this.catalogoTipoTorneoService.create(createCatalogoTipoTorneoDto);
  }

  @Public()
  @ApiOperation({ summary: 'Listar todos los tipos de torneo' })
  @Get()
  findAll() {
    return this.catalogoTipoTorneoService.findAll();
  }

  @Public()
  @ApiOperation({ summary: 'Obtener un tipo de torneo por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoTipoTorneoService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un tipo de torneo (admin)' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoTipoTorneoDto: UpdateCatalogoTipoTorneoDto) {
    return this.catalogoTipoTorneoService.update(id, updateCatalogoTipoTorneoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un tipo de torneo (admin)' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogoTipoTorneoService.remove(id);
  }
}
