import { IsNumber,  IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTransaccionDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber()
  usuarioId: string;

  @IsNotEmpty({ message: 'El ID del tipo es requerido' })
  @IsNumber()
  tipoId: string;

  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsString({ message: 'El monto debe ser una cadena de texto' })
  monto: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsNotEmpty({ message: 'El ID del origen es requerido' })
  @IsNumber()
  origenId: string;
}
