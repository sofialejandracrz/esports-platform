import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogoEstadoAmistadModule } from './modules/catalogo-estado-amistad/catalogo-estado-amistad.module';
import { CatalogoEstadoInscripcionModule } from './modules/catalogo-estado-inscripcion/catalogo-estado-inscripcion.module';
import { CatalogoEstadoTorneoModule } from './modules/catalogo-estado-torneo/catalogo-estado-torneo.module';
import { CatalogoAvatarModule } from './modules/catalogo-avatar/catalogo-avatar.module';
import { CatalogoGeneroModule } from './modules/catalogo-genero/catalogo-genero.module';
import { CatalogoOrigenTransaccionModule } from './modules/catalogo-origen-transaccion/catalogo-origen-transaccion.module';
import { CatalogoPlataformaModule } from './modules/catalogo-plataforma/catalogo-plataforma.module';
import { CatalogoRegionModule } from './modules/catalogo-region/catalogo-region.module';
import { CatalogoRolModule } from './modules/catalogo-rol/catalogo-rol.module';
import { CatalogoTipoEntradaModule } from './modules/catalogo-tipo-entrada/catalogo-tipo-entrada.module';
import { CatalogoTipoItemModule } from './modules/catalogo-tipo-item/catalogo-tipo-item.module';
import { CatalogoTipoTorneoModule } from './modules/catalogo-tipo-torneo/catalogo-tipo-torneo.module';
import { CatalogoTransaccionTipoModule } from './modules/catalogo-transaccion-tipo/catalogo-transaccion-tipo.module';
import { EquipoModule } from './modules/equipo/equipo.module';
import { EquipoMiembroModule } from './modules/equipo-miembro/equipo-miembro.module';
import { JuegoModule } from './modules/juego/juego.module';
import { MembresiaTipoModule } from './modules/membresia-tipo/membresia-tipo.module';
import { ModoJuegoModule } from './modules/modo-juego/modo-juego.module';
import { PersonaModule } from './modules/persona/persona.module';
import { TiendaItemModule } from './modules/tienda-item/tienda-item.module';
import { TiendaOrdenModule } from './modules/tienda-orden/tienda-orden.module';
import { TiendaSolicitudSoporteModule } from './modules/tienda-solicitud-soporte/tienda-solicitud-soporte.module';
import { TiendaModule } from './modules/tienda/tienda.module';
import { LogroModule } from './modules/logro/logro.module';
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
import { UsuarioSeguidoresModule } from './modules/usuario-seguidores/usuario-seguidores.module';
import { UsuarioRedSocialModule } from './modules/usuario-red-social/usuario-red-social.module';
import { UsuarioTrofeoModule } from './modules/usuario-trofeo/usuario-trofeo.module';
import { SeederModule } from './database/seeds/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV');
        const dbType = configService.get('DB_TYPE') || 'postgres';
        const dbHost = configService.get('DB_HOST');
        const isAzure = dbHost?.includes('azure');
        const dbSslValue = configService.get('DB_SSL');
        const sslEnabled = dbSslValue === 'true' || dbSslValue === true || isAzure;
        
        console.log('=== Database Configuration ===');
        console.log('NODE_ENV:', nodeEnv);
        console.log('DB_TYPE:', dbType);
        console.log('DB_HOST:', dbHost);
        console.log('DB_SSL raw value:', dbSslValue, 'type:', typeof dbSslValue);
        console.log('Is Azure:', isAzure);
        console.log('SSL enabled:', sslEnabled);
        console.log('==============================');
        
        // Configuración base común
        const baseConfig = {
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: nodeEnv !== 'production',
          logging: nodeEnv !== 'production',
        };

        // Configuración específica para Oracle
        if (dbType === 'oracle') {
          return {
            ...baseConfig,
            type: 'oracle',
            host: dbHost,
            port: +configService.get<number>('DB_PORT') || 1521,
            serviceName: configService.get('DB_SERVICE_NAME') || 'XEPDB1',
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            synchronize: false, // IMPORTANTE: Oracle no debe usar synchronize
          };
        }
        
        // Configuración para PostgreSQL (default)
        const sslConfig = sslEnabled ? {
          rejectUnauthorized: false,
          require: true,
        } : false;
        
        return {
          ...baseConfig,
          type: 'postgres',
          host: dbHost,
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          ssl: sslConfig,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    CatalogoAvatarModule,
    CatalogoEstadoAmistadModule,
    CatalogoEstadoInscripcionModule,
    CatalogoEstadoTorneoModule,
    CatalogoGeneroModule,
    CatalogoOrigenTransaccionModule,
    CatalogoPlataformaModule,
    CatalogoRegionModule,
    CatalogoRolModule,
    CatalogoTipoEntradaModule,
    CatalogoTipoItemModule,
    CatalogoTipoTorneoModule,
    CatalogoTransaccionTipoModule,
    EquipoModule,
    EquipoMiembroModule,
    JuegoModule,
    LogroModule,
    MembresiaTipoModule,
    ModoJuegoModule,
    PersonaModule,
    TiendaItemModule,
    TiendaOrdenModule,
    TiendaSolicitudSoporteModule,
    TiendaModule,
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
    UsuarioSeguidoresModule,
    UsuarioRedSocialModule,
    UsuarioTrofeoModule,
    SeederModule,
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
