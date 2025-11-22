import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ModoJuegoService } from './modo-juego.service';
import { CreateModoJuegoDto } from './dto/create-modo-juego.dto';
import { UpdateModoJuegoDto } from './dto/update-modo-juego.dto';

@Controller('modo-juego')
export class ModoJuegoController {
  constructor(private readonly modoJuegoService: ModoJuegoService) {}

  @Post()
  create(@Body() createModoJuegoDto: CreateModoJuegoDto) {
    return this.modoJuegoService.create(createModoJuegoDto);
  }

  @Get()
  findAll() {
    return this.modoJuegoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modoJuegoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModoJuegoDto: UpdateModoJuegoDto) {
    return this.modoJuegoService.update(id, updateModoJuegoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.modoJuegoService.remove(id);
  }
}
