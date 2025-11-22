import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTorneoResultadoDto } from './dto/create-torneo-resultado.dto';
import { UpdateTorneoResultadoDto } from './dto/update-torneo-resultado.dto';
import { TorneoResultado } from './entities/torneo-resultado.entity';
import { Torneo } from '../torneo/entities/torneo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class TorneoResultadoService {
  constructor(
    @InjectRepository(TorneoResultado)
    private readonly torneoResultadoRepository: Repository<TorneoResultado>,
    @InjectRepository(Torneo)
    private readonly torneoRepository: Repository<Torneo>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createTorneoResultadoDto: CreateTorneoResultadoDto): Promise<TorneoResultado> {
    const { torneoId, usuarioId, ...rest } = createTorneoResultadoDto;

    const torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
    if (!torneo) {
      throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
    }

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const torneoResultado = this.torneoResultadoRepository.create({
      ...rest,
      torneo,
      usuario,
    });

    return await this.torneoResultadoRepository.save(torneoResultado);
  }

  async findAll(): Promise<TorneoResultado[]> {
    return await this.torneoResultadoRepository.find({
      relations: ['torneo', 'usuario'],
      order: { posicion: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TorneoResultado> {
    const torneoResultado = await this.torneoResultadoRepository.findOne({
      where: { id },
      relations: ['torneo', 'usuario'],
    });

    if (!torneoResultado) {
      throw new NotFoundException(`Resultado con ID ${id} no encontrado`);
    }

    return torneoResultado;
  }

  async update(id: string, updateTorneoResultadoDto: UpdateTorneoResultadoDto): Promise<TorneoResultado> {
    const torneoResultado = await this.findOne(id);

    const { torneoId, usuarioId, ...rest } = updateTorneoResultadoDto;

    if (torneoId) {
      const torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
      if (!torneo) {
        throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
      }
      torneoResultado.torneo = torneo;
    }

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
      }
      torneoResultado.usuario = usuario;
    }

    Object.assign(torneoResultado, rest);
    return await this.torneoResultadoRepository.save(torneoResultado);
  }

  async remove(id: string): Promise<void> {
    const torneoResultado = await this.findOne(id);
    await this.torneoResultadoRepository.remove(torneoResultado);
  }
}
