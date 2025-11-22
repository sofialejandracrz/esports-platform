import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModoJuegoDto } from './dto/create-modo-juego.dto';
import { UpdateModoJuegoDto } from './dto/update-modo-juego.dto';
import { ModoJuego } from './entities/modo-juego.entity';
import { Juego } from '../juego/entities/juego.entity';

@Injectable()
export class ModoJuegoService {
  constructor(
    @InjectRepository(ModoJuego)
    private readonly modoJuegoRepository: Repository<ModoJuego>,
    @InjectRepository(Juego)
    private readonly juegoRepository: Repository<Juego>,
  ) {}

  async create(createModoJuegoDto: CreateModoJuegoDto): Promise<ModoJuego> {
    const { juegoId, ...rest } = createModoJuegoDto;

    const juego = await this.juegoRepository.findOne({ where: { id: juegoId } });
    if (!juego) {
      throw new NotFoundException(`Juego con ID ${juegoId} no encontrado`);
    }

    const modoJuego = this.modoJuegoRepository.create({
      ...rest,
      juego,
    });

    return await this.modoJuegoRepository.save(modoJuego);
  }

  async findAll(): Promise<ModoJuego[]> {
    return await this.modoJuegoRepository.find({
      relations: ['juego'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ModoJuego> {
    const modoJuego = await this.modoJuegoRepository.findOne({
      where: { id },
      relations: ['juego'],
    });

    if (!modoJuego) {
      throw new NotFoundException(`Modo de juego con ID ${id} no encontrado`);
    }

    return modoJuego;
  }

  async update(id: string, updateModoJuegoDto: UpdateModoJuegoDto): Promise<ModoJuego> {
    const modoJuego = await this.findOne(id);

    const { juegoId, ...rest } = updateModoJuegoDto;

    if (juegoId) {
      const juego = await this.juegoRepository.findOne({ where: { id: juegoId } });
      if (!juego) {
        throw new NotFoundException(`Juego con ID ${juegoId} no encontrado`);
      }
      modoJuego.juego = juego;
    }

    Object.assign(modoJuego, rest);
    return await this.modoJuegoRepository.save(modoJuego);
  }

  async remove(id: string): Promise<void> {
    const modoJuego = await this.findOne(id);
    await this.modoJuegoRepository.remove(modoJuego);
  }
}
