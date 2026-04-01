import { IsNumber,  IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUsuarioLogroDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber()
  usuarioId: string;

  @IsNotEmpty({ message: 'El ID del logro es requerido' })
  @IsNumber()
  logroId: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
  fecha?: string;
}
