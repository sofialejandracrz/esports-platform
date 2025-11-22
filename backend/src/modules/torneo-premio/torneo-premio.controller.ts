import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TorneoPremioService } from './torneo-premio.service';
import { CreateTorneoPremioDto } from './dto/create-torneo-premio.dto';
import { UpdateTorneoPremioDto } from './dto/update-torneo-premio.dto';

@Controller('torneo-premio')
export class TorneoPremioController {
  constructor(private readonly torneoPremioService: TorneoPremioService) {}

  @Post()
  create(@Body() createTorneoPremioDto: CreateTorneoPremioDto) {
    return this.torneoPremioService.create(createTorneoPremioDto);
  }

  @Get()
  findAll() {
    return this.torneoPremioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.torneoPremioService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTorneoPremioDto: UpdateTorneoPremioDto) {
    return this.torneoPremioService.update(id, updateTorneoPremioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.torneoPremioService.remove(id);
  }
}
