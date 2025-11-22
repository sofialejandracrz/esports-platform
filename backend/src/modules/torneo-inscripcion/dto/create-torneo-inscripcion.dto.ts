import { IsNotEmpty, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateTorneoInscripcionDto {
  @IsNotEmpty({ message: 'El ID del torneo es requerido' })
  @IsUUID('4', { message: 'El ID del torneo debe ser un UUID válido' })
  torneoId: string;

  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
  fecha?: string;

  @IsNotEmpty({ message: 'El ID del estado es requerido' })
  @IsUUID('4', { message: 'El ID del estado debe ser un UUID válido' })
  estadoId: string;
}
