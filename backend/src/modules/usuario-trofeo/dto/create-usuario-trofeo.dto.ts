import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateUsuarioTrofeoDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsOptional()
  @IsUUID('4', { message: 'El ID del torneo debe ser un UUID válido' })
  torneoId?: string;

  @IsNotEmpty({ message: 'El tipo de trofeo es requerido' })
  @IsString({ message: 'El tipo de trofeo debe ser texto' })
  @MaxLength(100, { message: 'El tipo de trofeo no puede exceder 100 caracteres' })
  tipoTrofeo: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
  ganadoEn?: string;
}
