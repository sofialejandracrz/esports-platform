import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioLogroDto } from './dto/create-usuario-logro.dto';
import { UpdateUsuarioLogroDto } from './dto/update-usuario-logro.dto';
import { UsuarioLogro } from './entities/usuario-logro.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Logro } from '../logro/entities/logro.entity';

@Injectable()
export class UsuarioLogroService {
  constructor(
    @InjectRepository(UsuarioLogro)
    private readonly usuarioLogroRepository: Repository<UsuarioLogro>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Logro)
    private readonly logroRepository: Repository<Logro>,
  ) {}

  async create(createUsuarioLogroDto: CreateUsuarioLogroDto): Promise<UsuarioLogro> {
    const { usuarioId, logroId, ...rest } = createUsuarioLogroDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const logro = await this.logroRepository.findOne({ where: { id: logroId } });
    if (!logro) {
      throw new NotFoundException(`Logro con ID ${logroId} no encontrado`);
    }

    const existeLogro = await this.usuarioLogroRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        logro: { id: logroId },
      },
    });

    if (existeLogro) {
      throw new ConflictException('El usuario ya tiene este logro');
    }

    const usuarioLogro = this.usuarioLogroRepository.create({
      ...rest,
      usuario,
      logro,
    });

    return await this.usuarioLogroRepository.save(usuarioLogro);
  }

  async findAll(): Promise<UsuarioLogro[]> {
    return await this.usuarioLogroRepository.find({
      relations: ['usuario', 'logro'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UsuarioLogro> {
    const usuarioLogro = await this.usuarioLogroRepository.findOne({
      where: { id },
      relations: ['usuario', 'logro'],
    });

    if (!usuarioLogro) {
      throw new NotFoundException(`Logro de usuario con ID ${id} no encontrado`);
    }

    return usuarioLogro;
  }

  async update(id: string, updateUsuarioLogroDto: UpdateUsuarioLogroDto): Promise<UsuarioLogro> {
    const usuarioLogro = await this.findOne(id);

    const { usuarioId, logroId, ...rest } = updateUsuarioLogroDto;

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
      }
      usuarioLogro.usuario = usuario;
    }

    if (logroId) {
      const logro = await this.logroRepository.findOne({ where: { id: logroId } });
      if (!logro) {
        throw new NotFoundException(`Logro con ID ${logroId} no encontrado`);
      }
      usuarioLogro.logro = logro;
    }

    Object.assign(usuarioLogro, rest);
    return await this.usuarioLogroRepository.save(usuarioLogro);
  }

  async remove(id: string): Promise<void> {
    const usuarioLogro = await this.findOne(id);
    await this.usuarioLogroRepository.remove(usuarioLogro);
  }
}
