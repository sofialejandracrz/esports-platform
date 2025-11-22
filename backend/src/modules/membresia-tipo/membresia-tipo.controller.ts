import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { MembresiaTipoService } from './membresia-tipo.service';
import { CreateMembresiaTipoDto } from './dto/create-membresia-tipo.dto';
import { UpdateMembresiaTipoDto } from './dto/update-membresia-tipo.dto';

@Controller('membresia-tipo')
export class MembresiaTipoController {
  constructor(private readonly membresiaTipoService: MembresiaTipoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMembresiaTipoDto: CreateMembresiaTipoDto) {
    return this.membresiaTipoService.create(createMembresiaTipoDto);
  }

  @Get()
  findAll() {
    return this.membresiaTipoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membresiaTipoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembresiaTipoDto: UpdateMembresiaTipoDto) {
    return this.membresiaTipoService.update(id, updateMembresiaTipoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.membresiaTipoService.remove(id);
  }
}
