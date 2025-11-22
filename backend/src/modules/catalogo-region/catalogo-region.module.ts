import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoRegionService } from './catalogo-region.service';
import { CatalogoRegionController } from './catalogo-region.controller';
import { CatalogoRegion } from './entities/catalogo-region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoRegion])],
  controllers: [CatalogoRegionController],
  providers: [CatalogoRegionService],
  exports: [CatalogoRegionService],
})
export class CatalogoRegionModule {}
