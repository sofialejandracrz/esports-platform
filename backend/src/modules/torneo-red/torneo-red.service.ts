import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTorneoRedDto } from './dto/create-torneo-red.dto';
import { UpdateTorneoRedDto } from './dto/update-torneo-red.dto';
import { TorneoRed } from './entities/torneo-red.entity';
import { Torneo } from '../torneo/entities/torneo.entity';

@Injectable()
export class TorneoRedService {
  constructor(
    @InjectRepository(TorneoRed)
    private readonly torneoRedRepository: Repository<TorneoRed>,
    @InjectRepository(Torneo)
    private readonly torneoRepository: Repository<Torneo>,
  ) {}

  async create(createTorneoRedDto: CreateTorneoRedDto): Promise<TorneoRed> {
    const { torneoId, ...redData } = createTorneoRedDto;

    const torneo = await this.torneoRepository.findOne({
      where: { id: torneoId },
    });

    if (!torneo) {
      throw new BadRequestException(`Torneo con ID ${torneoId} no encontrado`);
    }

    const torneoRed = this.torneoRedRepository.create({
      ...redData,
      torneo,
    });

    return await this.torneoRedRepository.save(torneoRed);
  }

  async findAll(): Promise<TorneoRed[]> {
    return await this.torneoRedRepository.find({
      relations: ['torneo'],
      order: { plataforma: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TorneoRed> {
    const torneoRed = await this.torneoRedRepository.findOne({
      where: { id },
      relations: ['torneo'],
    });

    if (!torneoRed) {
      throw new NotFoundException(`Red de torneo con ID ${id} no encontrada`);
    }

    return torneoRed;
  }

  async update(id: string, updateTorneoRedDto: UpdateTorneoRedDto): Promise<TorneoRed> {
    const torneoRed = await this.findOne(id);

    const { torneoId, ...redData } = updateTorneoRedDto;

    if (torneoId) {
      const torneo = await this.torneoRepository.findOne({
        where: { id: torneoId },
      });

      if (!torneo) {
        throw new BadRequestException(`Torneo con ID ${torneoId} no encontrado`);
      }

      torneoRed.torneo = torneo;
    }

    Object.assign(torneoRed, redData);
    return await this.torneoRedRepository.save(torneoRed);
  }

  async remove(id: string): Promise<void> {
    const torneoRed = await this.findOne(id);
    await this.torneoRedRepository.remove(torneoRed);
  }
}
