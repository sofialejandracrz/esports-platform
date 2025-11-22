import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTorneoPremioDto } from './dto/create-torneo-premio.dto';
import { UpdateTorneoPremioDto } from './dto/update-torneo-premio.dto';
import { TorneoPremio } from './entities/torneo-premio.entity';
import { Torneo } from '../torneo/entities/torneo.entity';

@Injectable()
export class TorneoPremioService {
  constructor(
    @InjectRepository(TorneoPremio)
    private readonly torneoPremioRepository: Repository<TorneoPremio>,
    @InjectRepository(Torneo)
    private readonly torneoRepository: Repository<Torneo>,
  ) {}

  async create(createTorneoPremioDto: CreateTorneoPremioDto): Promise<TorneoPremio> {
    const { torneoId, ...rest } = createTorneoPremioDto;

    const torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
    if (!torneo) {
      throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
    }

    const torneoPremio = this.torneoPremioRepository.create({
      ...rest,
      torneo,
    });

    return await this.torneoPremioRepository.save(torneoPremio);
  }

  async findAll(): Promise<TorneoPremio[]> {
    return await this.torneoPremioRepository.find({
      relations: ['torneo'],
      order: { fondoTotal: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TorneoPremio> {
    const torneoPremio = await this.torneoPremioRepository.findOne({
      where: { id },
      relations: ['torneo'],
    });

    if (!torneoPremio) {
      throw new NotFoundException(`Premio con ID ${id} no encontrado`);
    }

    return torneoPremio;
  }

  async update(id: string, updateTorneoPremioDto: UpdateTorneoPremioDto): Promise<TorneoPremio> {
    const torneoPremio = await this.findOne(id);

    const { torneoId, ...rest } = updateTorneoPremioDto;

    if (torneoId) {
      const torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
      if (!torneo) {
        throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
      }
      torneoPremio.torneo = torneo;
    }

    Object.assign(torneoPremio, rest);
    return await this.torneoPremioRepository.save(torneoPremio);
  }

  async remove(id: string): Promise<void> {
    const torneoPremio = await this.findOne(id);
    await this.torneoPremioRepository.remove(torneoPremio);
  }
}
