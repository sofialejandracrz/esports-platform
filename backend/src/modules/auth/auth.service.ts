import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Persona } from '../persona/entities/persona.entity';
import { CatalogoRol } from '../catalogo-rol/entities/catalogo-rol.entity';
import { CatalogoGenero } from '../catalogo-genero/entities/catalogo-genero.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(CatalogoRol)
    private catalogoRolRepository: Repository<CatalogoRol>,
    @InjectRepository(CatalogoGenero)
    private catalogoGeneroRepository: Repository<CatalogoGenero>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existingPersona = await this.personaRepository.findOne({
      where: { correo: registerDto.correo },
    });
    if (existingPersona) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Verificar si el nickname ya existe
    const existingNickname = await this.usuarioRepository.findOne({
      where: { nickname: registerDto.nickname },
    });
    if (existingNickname) {
      throw new ConflictException('El nickname ya está en uso');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Obtener el rol por defecto 'usuario'
    const rolUsuario = await this.catalogoRolRepository.findOne({
      where: { valor: 'usuario' },
    });
    if (!rolUsuario) {
      throw new BadRequestException('El rol de usuario no está configurado en el sistema');
    }

    // Obtener género si se proporcion
    let genero = null;
    if (registerDto.genero) {
      genero = await this.catalogoGeneroRepository.findOne({
        where: { valor: registerDto.genero },
      });
      if (!genero) {
        throw new BadRequestException('El género especificado no es válido');
      }
    }

    // Crear persona
    const persona = this.personaRepository.create({
      pNombre: registerDto.nombre,
      pApellido: registerDto.apellido,
      correo: registerDto.correo,
      fechaNacimiento: registerDto.fechaNacimiento?.toString(),
      genero,
      timezone: registerDto.timezone || 'UTC',
    });

    // Crear usuario con persona
    const usuario = this.usuarioRepository.create({
      persona,
      nickname: registerDto.nickname,
      password: hashedPassword,
      rol: rolUsuario,
      estado: 'activo',
    });

    await this.usuarioRepository.save(usuario);

    // Generar token
    const payload = { sub: usuario.id, nickname: usuario.nickname, rol: usuario.rol.valor };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      usuario: {
        id: usuario.id,
        nickname: usuario.nickname,
        rol: usuario.rol.valor,
        persona: {
          nombre: usuario.persona.pNombre,
          apellido: usuario.persona.pApellido,
          correo: usuario.persona.correo,
        },
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar por nickname o email
    let usuario: Usuario;

    if (loginDto.login.includes('@')) {
      // Es un email - buscar el usuario que tiene esa persona
      const persona = await this.personaRepository.findOne({
        where: { correo: loginDto.login },
      });
      
      if (persona) {
        usuario = await this.usuarioRepository.findOne({
          where: { persona: { id: persona.id } },
          relations: ['persona', 'rol'],
        });
      }
    } else {
      // Es un nickname
      usuario = await this.usuarioRepository.findOne({
        where: { nickname: loginDto.login },
        relations: ['persona', 'rol'],
      });
    }

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Cargar el password (campo con select: false)
    const usuarioConPassword = await this.usuarioRepository.findOne({
      where: { id: usuario.id },
      select: ['id', 'nickname', 'password', 'estado'],
      relations: ['persona', 'rol'],
    });

    // Verificar estado
    if (usuarioConPassword.estado === 'baneado') {
      throw new UnauthorizedException('Tu cuenta ha sido baneada');
    }
    if (usuarioConPassword.estado === 'suspendido') {
      throw new UnauthorizedException('Tu cuenta está suspendida');
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      usuarioConPassword.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar última conexión
    usuario.ultimaConexion = new Date();
    await this.usuarioRepository.save(usuario);

    // Generar token
    const payload = { sub: usuario.id, nickname: usuario.nickname, rol: usuario.rol.valor };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      usuario: {
        id: usuario.id,
        nickname: usuario.nickname,
        rol: usuario.rol.valor,
        persona: {
          nombre: usuario.persona.pNombre,
          apellido: usuario.persona.pApellido,
          correo: usuario.persona.correo,
        },
      },
    };
  }

  async validateUser(userId: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['persona', 'rol'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return usuario;
  }
}
