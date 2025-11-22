import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { Transaccion } from './entities/transaccion.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CatalogoTransaccionTipo } from '../catalogo-transaccion-tipo/entities/catalogo-transaccion-tipo.entity';
import { CatalogoOrigenTransaccion } from '../catalogo-origen-transaccion/entities/catalogo-origen-transaccion.entity';

@Injectable()
export class TransaccionService {
  constructor(
    @InjectRepository(Transaccion)
    private readonly transaccionRepository: Repository<Transaccion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(CatalogoTransaccionTipo)
    private readonly transaccionTipoRepository: Repository<CatalogoTransaccionTipo>,
    @InjectRepository(CatalogoOrigenTransaccion)
    private readonly origenTransaccionRepository: Repository<CatalogoOrigenTransaccion>,
  ) {}

  async create(createTransaccionDto: CreateTransaccionDto): Promise<Transaccion> {
    const { usuarioId, tipoId, origenId, ...transaccionData } = createTransaccionDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new BadRequestException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const tipo = await this.transaccionTipoRepository.findOne({
      where: { id: tipoId },
    });

    if (!tipo) {
      throw new BadRequestException(`Tipo de transacción con ID ${tipoId} no encontrado`);
    }

    const origen = await this.origenTransaccionRepository.findOne({
      where: { id: origenId },
    });

    if (!origen) {
      throw new BadRequestException(`Origen de transacción con ID ${origenId} no encontrado`);
    }

    const transaccion = this.transaccionRepository.create({
      ...transaccionData,
      usuario,
      tipo,
      origen,
    });

    return await this.transaccionRepository.save(transaccion);
  }

  async findAll(): Promise<Transaccion[]> {
    return await this.transaccionRepository.find({
      relations: ['usuario', 'tipo', 'origen'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Transaccion> {
    const transaccion = await this.transaccionRepository.findOne({
      where: { id },
      relations: ['usuario', 'tipo', 'origen'],
    });

    if (!transaccion) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return transaccion;
  }

  async update(id: string, updateTransaccionDto: UpdateTransaccionDto): Promise<Transaccion> {
    const transaccion = await this.findOne(id);

    const { usuarioId, tipoId, origenId, ...transaccionData } = updateTransaccionDto;

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: usuarioId },
      });

      if (!usuario) {
        throw new BadRequestException(`Usuario con ID ${usuarioId} no encontrado`);
      }

      transaccion.usuario = usuario;
    }

    if (tipoId) {
      const tipo = await this.transaccionTipoRepository.findOne({
        where: { id: tipoId },
      });

      if (!tipo) {
        throw new BadRequestException(`Tipo de transacción con ID ${tipoId} no encontrado`);
      }

      transaccion.tipo = tipo;
    }

    if (origenId) {
      const origen = await this.origenTransaccionRepository.findOne({
        where: { id: origenId },
      });

      if (!origen) {
        throw new BadRequestException(`Origen de transacción con ID ${origenId} no encontrado`);
      }

      transaccion.origen = origen;
    }

    Object.assign(transaccion, transaccionData);
    return await this.transaccionRepository.save(transaccion);
  }

  async remove(id: string): Promise<void> {
    const transaccion = await this.findOne(id);
    await this.transaccionRepository.remove(transaccion);
  }
}
