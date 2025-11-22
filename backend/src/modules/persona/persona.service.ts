import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import { CatalogoGenero } from '../catalogo-genero/entities/catalogo-genero.entity';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(CatalogoGenero)
    private readonly generoRepository: Repository<CatalogoGenero>,
  ) {}

  async create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    const { generoId, ...personaData } = createPersonaDto;

    let genero = null;
    if (generoId) {
      genero = await this.generoRepository.findOne({
        where: { id: generoId },
      });

      if (!genero) {
        throw new BadRequestException(`Género con ID ${generoId} no encontrado`);
      }
    }

    try {
      const persona = this.personaRepository.create({
        ...personaData,
        genero,
      });
      return await this.personaRepository.save(persona);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El correo ya está registrado');
      }
      throw error;
    }
  }

  async findAll(): Promise<Persona[]> {
    return await this.personaRepository.find({
      relations: ['genero'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Persona> {
    const persona = await this.personaRepository.findOne({
      where: { id },
      relations: ['genero'],
    });
    
    if (!persona) {
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);
    }
    
    return persona;
  }

  async update(id: string, updatePersonaDto: UpdatePersonaDto): Promise<Persona> {
    const persona = await this.findOne(id);
    
    const { generoId, ...personaData } = updatePersonaDto;

    if (generoId !== undefined) {
      if (generoId) {
        const genero = await this.generoRepository.findOne({
          where: { id: generoId },
        });

        if (!genero) {
          throw new BadRequestException(`Género con ID ${generoId} no encontrado`);
        }

        persona.genero = genero;
      } else {
        persona.genero = null;
      }
    }
    
    try {
      Object.assign(persona, personaData);
      return await this.personaRepository.save(persona);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El correo ya está registrado');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const persona = await this.findOne(id);
    await this.personaRepository.remove(persona);
  }
}
