import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoTipoItemService } from './catalogo-tipo-item.service';
import { CatalogoTipoItemController } from './catalogo-tipo-item.controller';
import { CatalogoTipoItem } from './entities/catalogo-tipo-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoTipoItem])],
  controllers: [CatalogoTipoItemController],
  providers: [CatalogoTipoItemService],
  exports: [CatalogoTipoItemService],
})
export class CatalogoTipoItemModule {}
