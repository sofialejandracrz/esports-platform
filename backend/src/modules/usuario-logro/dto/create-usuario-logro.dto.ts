import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateUsuarioLogroDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsNotEmpty({ message: 'El ID del logro es requerido' })
  @IsUUID('4', { message: 'El ID del logro debe ser un UUID válido' })
  logroId: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
  fecha?: string;
}
