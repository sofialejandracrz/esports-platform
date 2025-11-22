import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateJuegoDto } from './dto/create-juego.dto';
import { UpdateJuegoDto } from './dto/update-juego.dto';
import { Juego } from './entities/juego.entity';
import { CatalogoPlataforma } from '../catalogo-plataforma/entities/catalogo-plataforma.entity';

@Injectable()
export class JuegoService {
  constructor(
    @InjectRepository(Juego)
    private readonly juegoRepository: Repository<Juego>,
    @InjectRepository(CatalogoPlataforma)
    private readonly catalogoPlataformaRepository: Repository<CatalogoPlataforma>,
  ) {}

  async create(createJuegoDto: CreateJuegoDto): Promise<Juego> {
    const existing = await this.juegoRepository.findOne({
      where: { nombre: createJuegoDto.nombre },
    });

    if (existing) {
      throw new ConflictException('Ya existe un juego con ese nombre');
    }

    let plataformas = [];
    if (createJuegoDto.plataformaIds && createJuegoDto.plataformaIds.length > 0) {
      plataformas = await this.catalogoPlataformaRepository.findBy({
        id: In(createJuegoDto.plataformaIds),
      });
    }

    const juego = this.juegoRepository.create({
      nombre: createJuegoDto.nombre,
      descripcion: createJuegoDto.descripcion,
      plataformas,
    });

    return await this.juegoRepository.save(juego);
  }

  async findAll(): Promise<Juego[]> {
    return await this.juegoRepository.find({
      relations: ['plataformas', 'modos'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Juego> {
    const juego = await this.juegoRepository.findOne({
      where: { id },
      relations: ['plataformas', 'modos'],
    });

    if (!juego) {
      throw new NotFoundException(`Juego con ID ${id} no encontrado`);
    }

    return juego;
  }

  async update(id: string, updateJuegoDto: UpdateJuegoDto): Promise<Juego> {
    const juego = await this.findOne(id);

    if (updateJuegoDto.nombre && updateJuegoDto.nombre !== juego.nombre) {
      const existing = await this.juegoRepository.findOne({
        where: { nombre: updateJuegoDto.nombre },
      });

      if (existing) {
        throw new ConflictException('Ya existe un juego con ese nombre');
      }
    }

    if (updateJuegoDto.plataformaIds) {
      const plataformas = await this.catalogoPlataformaRepository.findBy({
        id: In(updateJuegoDto.plataformaIds),
      });
      juego.plataformas = plataformas;
    }

    Object.assign(juego, {
      nombre: updateJuegoDto.nombre,
      descripcion: updateJuegoDto.descripcion,
    });

    return await this.juegoRepository.save(juego);
  }

  async remove(id: string): Promise<void> {
    const juego = await this.findOne(id);
    await this.juegoRepository.remove(juego);
  }
}
