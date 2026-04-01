import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoAvatarDto, UpdateCatalogoAvatarDto } from './dto';
import { CatalogoAvatar } from './entities/catalogo-avatar.entity';

@Injectable()
export class CatalogoAvatarService {
  constructor(
    @InjectRepository(CatalogoAvatar)
    private readonly catalogoAvatarRepository: Repository<CatalogoAvatar>,
  ) {}

  async create(createCatalogoAvatarDto: CreateCatalogoAvatarDto): Promise<CatalogoAvatar> {
    const avatar = this.catalogoAvatarRepository.create(createCatalogoAvatarDto);
    return await this.catalogoAvatarRepository.save(avatar);
  }

  async findAll(): Promise<CatalogoAvatar[]> {
    return await this.catalogoAvatarRepository.find({
      where: { disponible: 1 },
      order: { nombre: 'ASC' },
    });
  }

  async findAllWithPremium(): Promise<CatalogoAvatar[]> {
    return await this.catalogoAvatarRepository.find({
      where: { disponible: 1 },
      order: { premium: 'DESC', nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoAvatar> {
    const avatar = await this.catalogoAvatarRepository.findOne({
      where: { id: +id },
    });

    if (!avatar) {
      throw new NotFoundException(`Avatar con ID ${id} no encontrado`);
    }

    return avatar;
  }

  async findBySeed(seed: string): Promise<CatalogoAvatar> {
    const avatar = await this.catalogoAvatarRepository.findOne({
      where: { seed },
    });

    if (!avatar) {
      throw new NotFoundException(`Avatar con seed ${seed} no encontrado`);
    }

    return avatar;
  }

  async update(id: string, updateCatalogoAvatarDto: UpdateCatalogoAvatarDto): Promise<CatalogoAvatar> {
    const avatar = await this.findOne(id);
    Object.assign(avatar, updateCatalogoAvatarDto);
    return await this.catalogoAvatarRepository.save(avatar);
  }

  async remove(id: string): Promise<void> {
    const avatar = await this.findOne(id);
    await this.catalogoAvatarRepository.remove(avatar);
  }
}
