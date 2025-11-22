import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoPlataformaService } from './catalogo-plataforma.service';
import { CatalogoPlataformaController } from './catalogo-plataforma.controller';
import { CatalogoPlataforma } from './entities/catalogo-plataforma.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoPlataforma])],
  controllers: [CatalogoPlataformaController],
  providers: [CatalogoPlataformaService],
  exports: [CatalogoPlataformaService],
})
export class CatalogoPlataformaModule {}
