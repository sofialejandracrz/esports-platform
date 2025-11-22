import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioCuentaJuegoDto } from './dto/create-usuario-cuenta-juego.dto';
import { UpdateUsuarioCuentaJuegoDto } from './dto/update-usuario-cuenta-juego.dto';
import { UsuarioCuentaJuego } from './entities/usuario-cuenta-juego.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CatalogoPlataforma } from '../catalogo-plataforma/entities/catalogo-plataforma.entity';

@Injectable()
export class UsuarioCuentaJuegoService {
  constructor(
    @InjectRepository(UsuarioCuentaJuego)
    private readonly usuarioCuentaJuegoRepository: Repository<UsuarioCuentaJuego>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(CatalogoPlataforma)
    private readonly plataformaRepository: Repository<CatalogoPlataforma>,
  ) {}

  async create(createUsuarioCuentaJuegoDto: CreateUsuarioCuentaJuegoDto): Promise<UsuarioCuentaJuego> {
    const { usuarioId, plataformaJuegoId, ...cuentaData } = createUsuarioCuentaJuegoDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new BadRequestException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const plataformaJuego = await this.plataformaRepository.findOne({
      where: { id: plataformaJuegoId },
    });

    if (!plataformaJuego) {
      throw new BadRequestException(`Plataforma con ID ${plataformaJuegoId} no encontrada`);
    }

    const usuarioCuentaJuego = this.usuarioCuentaJuegoRepository.create({
      ...cuentaData,
      usuario,
      plataformaJuego,
    });

    return await this.usuarioCuentaJuegoRepository.save(usuarioCuentaJuego);
  }

  async findAll(): Promise<UsuarioCuentaJuego[]> {
    return await this.usuarioCuentaJuegoRepository.find({
      relations: ['usuario', 'plataformaJuego'],
      order: { identificador: 'ASC' },
    });
  }

  async findOne(id: string): Promise<UsuarioCuentaJuego> {
    const usuarioCuentaJuego = await this.usuarioCuentaJuegoRepository.findOne({
      where: { id },
      relations: ['usuario', 'plataformaJuego'],
    });

    if (!usuarioCuentaJuego) {
      throw new NotFoundException(`Cuenta de juego con ID ${id} no encontrada`);
    }

    return usuarioCuentaJuego;
  }

  async update(id: string, updateUsuarioCuentaJuegoDto: UpdateUsuarioCuentaJuegoDto): Promise<UsuarioCuentaJuego> {
    const usuarioCuentaJuego = await this.findOne(id);

    const { usuarioId, plataformaJuegoId, ...cuentaData } = updateUsuarioCuentaJuegoDto;

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: usuarioId },
      });

      if (!usuario) {
        throw new BadRequestException(`Usuario con ID ${usuarioId} no encontrado`);
      }

      usuarioCuentaJuego.usuario = usuario;
    }

    if (plataformaJuegoId) {
      const plataformaJuego = await this.plataformaRepository.findOne({
        where: { id: plataformaJuegoId },
      });

      if (!plataformaJuego) {
        throw new BadRequestException(`Plataforma con ID ${plataformaJuegoId} no encontrada`);
      }

      usuarioCuentaJuego.plataformaJuego = plataformaJuego;
    }

    Object.assign(usuarioCuentaJuego, cuentaData);
    return await this.usuarioCuentaJuegoRepository.save(usuarioCuentaJuego);
  }

  async remove(id: string): Promise<void> {
    const usuarioCuentaJuego = await this.findOne(id);
    await this.usuarioCuentaJuegoRepository.remove(usuarioCuentaJuego);
  }
}
