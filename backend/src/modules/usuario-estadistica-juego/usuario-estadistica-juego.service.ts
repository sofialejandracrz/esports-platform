import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioEstadisticaJuegoDto } from './dto/create-usuario-estadistica-juego.dto';
import { UpdateUsuarioEstadisticaJuegoDto } from './dto/update-usuario-estadistica-juego.dto';
import { UsuarioEstadisticaJuego } from './entities/usuario-estadistica-juego.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Juego } from '../juego/entities/juego.entity';

@Injectable()
export class UsuarioEstadisticaJuegoService {
  constructor(
    @InjectRepository(UsuarioEstadisticaJuego)
    private readonly usuarioEstadisticaJuegoRepository: Repository<UsuarioEstadisticaJuego>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Juego)
    private readonly juegoRepository: Repository<Juego>,
  ) {}

  async create(createUsuarioEstadisticaJuegoDto: CreateUsuarioEstadisticaJuegoDto): Promise<UsuarioEstadisticaJuego> {
    const { usuarioId, juegoId, ...rest } = createUsuarioEstadisticaJuegoDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const juego = await this.juegoRepository.findOne({ where: { id: juegoId } });
    if (!juego) {
      throw new NotFoundException(`Juego con ID ${juegoId} no encontrado`);
    }

    const usuarioEstadisticaJuego = this.usuarioEstadisticaJuegoRepository.create({
      ...rest,
      usuario,
      juego,
    });

    return await this.usuarioEstadisticaJuegoRepository.save(usuarioEstadisticaJuego);
  }

  async findAll(): Promise<UsuarioEstadisticaJuego[]> {
    return await this.usuarioEstadisticaJuegoRepository.find({
      relations: ['usuario', 'juego'],
      order: { actualizadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UsuarioEstadisticaJuego> {
    const usuarioEstadisticaJuego = await this.usuarioEstadisticaJuegoRepository.findOne({
      where: { id },
      relations: ['usuario', 'juego'],
    });

    if (!usuarioEstadisticaJuego) {
      throw new NotFoundException(`Estadística de juego con ID ${id} no encontrada`);
    }

    return usuarioEstadisticaJuego;
  }

  async update(id: string, updateUsuarioEstadisticaJuegoDto: UpdateUsuarioEstadisticaJuegoDto): Promise<UsuarioEstadisticaJuego> {
    const usuarioEstadisticaJuego = await this.findOne(id);

    const { usuarioId, juegoId, ...rest } = updateUsuarioEstadisticaJuegoDto;

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
      }
      usuarioEstadisticaJuego.usuario = usuario;
    }

    if (juegoId) {
      const juego = await this.juegoRepository.findOne({ where: { id: juegoId } });
      if (!juego) {
        throw new NotFoundException(`Juego con ID ${juegoId} no encontrado`);
      }
      usuarioEstadisticaJuego.juego = juego;
    }

    Object.assign(usuarioEstadisticaJuego, rest);
    return await this.usuarioEstadisticaJuegoRepository.save(usuarioEstadisticaJuego);
  }

  async remove(id: string): Promise<void> {
    const usuarioEstadisticaJuego = await this.findOne(id);
    await this.usuarioEstadisticaJuegoRepository.remove(usuarioEstadisticaJuego);
  }
}
