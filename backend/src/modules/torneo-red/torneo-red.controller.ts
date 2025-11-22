import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TorneoRedService } from './torneo-red.service';
import { CreateTorneoRedDto } from './dto/create-torneo-red.dto';
import { UpdateTorneoRedDto } from './dto/update-torneo-red.dto';

@Controller('torneo-red')
export class TorneoRedController {
  constructor(private readonly torneoRedService: TorneoRedService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTorneoRedDto: CreateTorneoRedDto) {
    return this.torneoRedService.create(createTorneoRedDto);
  }

  @Get()
  findAll() {
    return this.torneoRedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.torneoRedService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTorneoRedDto: UpdateTorneoRedDto) {
    return this.torneoRedService.update(id, updateTorneoRedDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.torneoRedService.remove(id);
  }
}
