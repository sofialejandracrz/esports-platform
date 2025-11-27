import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @ApiOperation({ summary: 'Iniciar sesión' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario actual' })
  @Get('me')
  async me(@Request() req) {
    const usuario = await this.authService.validateUser(req.user.userId);
    return {
      id: usuario.id,
      nickname: usuario.nickname,
      rol: usuario.rol.valor,
      avatar: usuario.avatar,
      saldo: usuario.saldo,
      creditos: usuario.creditos,
      xp: usuario.xp,
      estado: usuario.estado,
      persona: {
        nombre: usuario.persona.pNombre,
        apellido: usuario.persona.pApellido,
        correo: usuario.persona.correo,
        fechaNacimiento: usuario.persona.fechaNacimiento,
        genero: usuario.persona.genero,
        timezone: usuario.persona.timezone,
      },
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar token' })
  @Get('validate')
  async validate(@Request() req) {
    return { valid: true, userId: req.user.userId };
  }
}
