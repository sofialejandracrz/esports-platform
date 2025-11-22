import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogoGeneroModule } from './modules/catalogo-genero/catalogo-genero.module';
import { CatalogoEstadoAmistadModule } from './modules/catalogo-estado-amistad/catalogo-estado-amistad.module';
import { CatalogoEstadoInscripcionModule } from './modules/catalogo-estado-inscripcion/catalogo-estado-inscripcion.module';
import { CatalogoEstadoTorneoModule } from './modules/catalogo-estado-torneo/catalogo-estado-torneo.module';
import { CatalogoOrigenTransaccionModule } from './modules/catalogo-origen-transaccion/catalogo-origen-transaccion.module';
import { CatalogoPlataformaModule } from './modules/catalogo-plataforma/catalogo-plataforma.module';
import { CatalogoRegionModule } from './modules/catalogo-region/catalogo-region.module';
import { CatalogoRolModule } from './modules/catalogo-rol/catalogo-rol.module';
import { CatalogoTipoEntradaModule } from './modules/catalogo-tipo-entrada/catalogo-tipo-entrada.module';
import { CatalogoTipoItemModule } from './modules/catalogo-tipo-item/catalogo-tipo-item.module';
import { CatalogoTransaccionTipoModule } from './modules/catalogo-transaccion-tipo/catalogo-transaccion-tipo.module';
import { EquipoModule } from './modules/equipo/equipo.module';
import { EquipoMiembroModule } from './modules/equipo-miembro/equipo-miembro.module';
import { JuegoModule } from './modules/juego/juego.module';
import { MembresiaTipoModule } from './modules/membresia-tipo/membresia-tipo.module';
import { LogroModule } from './modules/logro/logro.module';
import { ModoJuegoModule } from './modules/modo-juego/modo-juego.module';
import { PersonaModule } from './modules/persona/persona.module';
import { TiendaItemModule } from './modules/tienda-item/tienda-item.module';
import { TorneoModule } from './modules/torneo/torneo.module';
import { TorneoInscripcionModule } from './modules/torneo-inscripcion/torneo-inscripcion.module';
import { TorneoPremioModule } from './modules/torneo-premio/torneo-premio.module';
import { TorneoRedModule } from './modules/torneo-red/torneo-red.module';
import { TorneoResultadoModule } from './modules/torneo-resultado/torneo-resultado.module';
import { TransaccionModule } from './modules/transaccion/transaccion.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { UsuarioAmigosModule } from './modules/usuario-amigos/usuario-amigos.module';
import { UsuarioCuentaJuegoModule } from './modules/usuario-cuenta-juego/usuario-cuenta-juego.module';
import { UsuarioEstadisticaJuegoModule } from './modules/usuario-estadistica-juego/usuario-estadistica-juego.module';
import { UsuarioLogroModule } from './modules/usuario-logro/usuario-logro.module';
import { UsuarioMembresiaModule } from './modules/usuario-membresia/usuario-membresia.module';
import { UsuarioRedSocialModule } from './modules/usuario-red-social/usuario-red-social.module';
import { UsuarioSeguidoresModule } from './modules/usuario-seguidores/usuario-seguidores.module';
import { UsuarioTrofeoModule } from './modules/usuario-trofeo/usuario-trofeo.module';

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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CatalogoGeneroModule,
    CatalogoEstadoAmistadModule,
    CatalogoEstadoInscripcionModule,
    CatalogoEstadoTorneoModule,
    CatalogoOrigenTransaccionModule,
    CatalogoPlataformaModule,
    CatalogoRegionModule,
    CatalogoRolModule,
    CatalogoTipoEntradaModule,
    CatalogoTipoItemModule,
    CatalogoTransaccionTipoModule,
    EquipoModule,
    EquipoMiembroModule,
    JuegoModule,
    MembresiaTipoModule,
    LogroModule,
    ModoJuegoModule,
    PersonaModule,
    TiendaItemModule,
    TorneoModule,
    TorneoInscripcionModule,
    TorneoPremioModule,
    TorneoRedModule,
    TorneoResultadoModule,
    TransaccionModule,
    UsuarioModule,
    UsuarioAmigosModule,
    UsuarioCuentaJuegoModule,
    UsuarioEstadisticaJuegoModule,
    UsuarioLogroModule,
    UsuarioMembresiaModule,
    UsuarioRedSocialModule,
    UsuarioSeguidoresModule,
    UsuarioTrofeoModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
