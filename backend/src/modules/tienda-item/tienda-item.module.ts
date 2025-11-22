import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaItemService } from './tienda-item.service';
import { TiendaItemController } from './tienda-item.controller';
import { TiendaItem } from './entities/tienda-item.entity';
import { CatalogoTipoItem } from '../catalogo-tipo-item/entities/catalogo-tipo-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaItem, CatalogoTipoItem])],
  controllers: [TiendaItemController],
  providers: [TiendaItemService],
  exports: [TiendaItemService],
})
export class TiendaItemModule {}
