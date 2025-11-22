import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { JuegoService } from './juego.service';
import { CreateJuegoDto } from './dto/create-juego.dto';
import { UpdateJuegoDto } from './dto/update-juego.dto';

@Controller('juego')
export class JuegoController {
  constructor(private readonly juegoService: JuegoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJuegoDto: CreateJuegoDto) {
    return this.juegoService.create(createJuegoDto);
  }

  @Get()
  findAll() {
    return this.juegoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.juegoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJuegoDto: UpdateJuegoDto) {
    return this.juegoService.update(id, updateJuegoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.juegoService.remove(id);
  }
}
