import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Persona } from '../persona/entities/persona.entity';
import { CatalogoRol } from '../catalogo-rol/entities/catalogo-rol.entity';
import { CatalogoGenero } from '../catalogo-genero/entities/catalogo-genero.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Persona, CatalogoRol, CatalogoGenero]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'supersecretkey',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
