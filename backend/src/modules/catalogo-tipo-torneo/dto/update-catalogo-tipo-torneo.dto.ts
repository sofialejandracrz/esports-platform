import { PartialType } from '@nestjs/mapped-types';
import { CreateCatalogoTipoTorneoDto } from './create-catalogo-tipo-torneo.dto';

export class UpdateCatalogoTipoTorneoDto extends PartialType(CreateCatalogoTipoTorneoDto) {}
