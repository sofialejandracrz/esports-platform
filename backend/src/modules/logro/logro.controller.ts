import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { LogroService } from './logro.service';
import { CreateLogroDto } from './dto/create-logro.dto';
import { UpdateLogroDto } from './dto/update-logro.dto';

@Controller('logro')
export class LogroController {
  constructor(private readonly logroService: LogroService) {}

  @Post()
  create(@Body() createLogroDto: CreateLogroDto) {
    return this.logroService.create(createLogroDto);
  }

  @Get()
  findAll() {
    return this.logroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logroService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogroDto: UpdateLogroDto) {
    return this.logroService.update(id, updateLogroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.logroService.remove(id);
  }
}
