import { IsNumber,  IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateTorneoInscripcionDto {
  @IsNotEmpty({ message: 'El ID del torneo es requerido' })
  @IsNumber()
  torneoId: string;

  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber()
  usuarioId: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
  fecha?: string;

  @IsNotEmpty({ message: 'El ID del estado es requerido' })
  @IsNumber()
  estadoId: string;
}
