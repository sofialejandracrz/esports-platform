import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogroDto } from './dto/create-logro.dto';
import { UpdateLogroDto } from './dto/update-logro.dto';
import { Logro } from './entities/logro.entity';

@Injectable()
export class LogroService {
  constructor(
    @InjectRepository(Logro)
    private readonly logroRepository: Repository<Logro>,
  ) {}

  async create(createLogroDto: CreateLogroDto): Promise<Logro> {
    try {
      const logro = this.logroRepository.create(createLogroDto);
      return await this.logroRepository.save(logro);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre del logro ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<Logro[]> {
    return await this.logroRepository.find({
      order: { puntos: 'DESC', creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Logro> {
    const logro = await this.logroRepository.findOne({
      where: { id },
    });
    
    if (!logro) {
      throw new NotFoundException(`Logro con ID ${id} no encontrado`);
    }
    
    return logro;
  }

  async update(id: string, updateLogroDto: UpdateLogroDto): Promise<Logro> {
    const logro = await this.findOne(id);
    
    try {
      Object.assign(logro, updateLogroDto);
      return await this.logroRepository.save(logro);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre del logro ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const logro = await this.findOne(id);
    await this.logroRepository.remove(logro);
  }
}
