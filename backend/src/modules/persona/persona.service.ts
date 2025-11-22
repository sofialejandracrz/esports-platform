import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly catalogoGeneroRepository: Repository<CatalogoGenero>,
  ) {}

  async create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    const { generoId, ...rest } = createPersonaDto;

    const existeCorreo = await this.personaRepository.findOne({
      where: { correo: createPersonaDto.correo },
    });

    if (existeCorreo) {
      throw new ConflictException(`El correo ${createPersonaDto.correo} ya está registrado`);
    }

    let genero = undefined;
    if (generoId) {
      genero = await this.catalogoGeneroRepository.findOne({ where: { id: generoId } });
      if (!genero) {
        throw new NotFoundException(`Género con ID ${generoId} no encontrado`);
      }
    }

    const persona = this.personaRepository.create({
      ...rest,
      genero,
    });

    return await this.personaRepository.save(persona);
  }

  async findAll(): Promise<Persona[]> {
    return await this.personaRepository.find({
      relations: ['genero'],
      order: { pNombre: 'ASC', pApellido: 'ASC' },
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

    const { generoId, correo, ...rest } = updatePersonaDto;

    if (correo && correo !== persona.correo) {
      const existeCorreo = await this.personaRepository.findOne({
        where: { correo },
      });

      if (existeCorreo) {
        throw new ConflictException(`El correo ${correo} ya está registrado`);
      }
      persona.correo = correo;
    }

    if (generoId !== undefined) {
      if (generoId === null) {
        persona.genero = null;
      } else {
        const genero = await this.catalogoGeneroRepository.findOne({ where: { id: generoId } });
        if (!genero) {
          throw new NotFoundException(`Género con ID ${generoId} no encontrado`);
        }
        persona.genero = genero;
      }
    }

    Object.assign(persona, rest);
    return await this.personaRepository.save(persona);
  }

  async remove(id: string): Promise<void> {
    const persona = await this.findOne(id);
    await this.personaRepository.remove(persona);
  }
}
