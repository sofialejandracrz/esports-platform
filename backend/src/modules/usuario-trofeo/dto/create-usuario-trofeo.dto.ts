import { IsNumber,  IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUsuarioTrofeoDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber()
  usuarioId: string;

  @IsOptional()
  @IsNumber()
  torneoId?: string;

  @IsNotEmpty({ message: 'El tipo de trofeo es requerido' })
  @IsString({ message: 'El tipo de trofeo debe ser texto' })
  @MaxLength(100, { message: 'El tipo de trofeo no puede exceder 100 caracteres' })
  tipoTrofeo: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
  ganadoEn?: string;
}
