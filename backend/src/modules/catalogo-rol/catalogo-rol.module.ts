import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoRolService } from './catalogo-rol.service';
import { CatalogoRolController } from './catalogo-rol.controller';
import { CatalogoRol } from './entities/catalogo-rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoRol])],
  controllers: [CatalogoRolController],
  providers: [CatalogoRolService],
  exports: [CatalogoRolService],
})
export class CatalogoRolModule {}
