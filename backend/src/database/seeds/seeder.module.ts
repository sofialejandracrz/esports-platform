import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CatalogoRol } from '../../modules/catalogo-rol/entities/catalogo-rol.entity';
import { CatalogoGenero } from '../../modules/catalogo-genero/entities/catalogo-genero.entity';
import { CatalogoEstadoAmistad } from '../../modules/catalogo-estado-amistad/entities/catalogo-estado-amistad.entity';
import { CatalogoEstadoInscripcion } from '../../modules/catalogo-estado-inscripcion/entities/catalogo-estado-inscripcion.entity';
import { CatalogoEstadoTorneo } from '../../modules/catalogo-estado-torneo/entities/catalogo-estado-torneo.entity';
import { CatalogoOrigenTransaccion } from '../../modules/catalogo-origen-transaccion/entities/catalogo-origen-transaccion.entity';
import { CatalogoPlataforma } from '../../modules/catalogo-plataforma/entities/catalogo-plataforma.entity';
import { CatalogoRegion } from '../../modules/catalogo-region/entities/catalogo-region.entity';
import { CatalogoTipoEntrada } from '../../modules/catalogo-tipo-entrada/entities/catalogo-tipo-entrada.entity';
import { CatalogoTipoItem } from '../../modules/catalogo-tipo-item/entities/catalogo-tipo-item.entity';
import { CatalogoTransaccionTipo } from '../../modules/catalogo-transaccion-tipo/entities/catalogo-transaccion-tipo.entity';
import { Persona } from '../../modules/persona/entities/persona.entity';
import { Usuario } from '../../modules/usuario/entities/usuario.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      CatalogoRol,
      CatalogoGenero,
      CatalogoEstadoAmistad,
      CatalogoEstadoInscripcion,
      CatalogoEstadoTorneo,
      CatalogoOrigenTransaccion,
      CatalogoPlataforma,
      CatalogoRegion,
      CatalogoTipoEntrada,
      CatalogoTipoItem,
      CatalogoTransaccionTipo,
      Persona,
      Usuario,
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
