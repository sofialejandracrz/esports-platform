import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
    private readonly plataformaRepository: Repository<CatalogoPlataforma>,
  ) {}

  async create(createJuegoDto: CreateJuegoDto): Promise<Juego> {
    const { plataformasIds, ...juegoData } = createJuegoDto;

    let plataformas: CatalogoPlataforma[] = [];
    if (plataformasIds && plataformasIds.length > 0) {
      plataformas = await this.plataformaRepository.findBy({
        id: In(plataformasIds),
      });

      if (plataformas.length !== plataformasIds.length) {
        throw new BadRequestException('Una o más plataformas no fueron encontradas');
      }
    }

    try {
      const juego = this.juegoRepository.create({
        ...juegoData,
        plataformas,
      });
      return await this.juegoRepository.save(juego);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre del juego ya existe');
      }
      throw error;
    }
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
    
    const { plataformasIds, ...juegoData } = updateJuegoDto;

    if (plataformasIds !== undefined) {
      if (plataformasIds.length > 0) {
        const plataformas = await this.plataformaRepository.findBy({
          id: In(plataformasIds),
        });

        if (plataformas.length !== plataformasIds.length) {
          throw new BadRequestException('Una o más plataformas no fueron encontradas');
        }

        juego.plataformas = plataformas;
      } else {
        juego.plataformas = [];
      }
    }
    
    try {
      Object.assign(juego, juegoData);
      return await this.juegoRepository.save(juego);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre del juego ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const juego = await this.findOne(id);
    await this.juegoRepository.remove(juego);
  }
}
