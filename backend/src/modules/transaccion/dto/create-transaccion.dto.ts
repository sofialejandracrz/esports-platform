import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTransaccionDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsNotEmpty({ message: 'El ID del tipo es requerido' })
  @IsUUID('4', { message: 'El ID del tipo debe ser un UUID válido' })
  tipoId: string;

  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsString({ message: 'El monto debe ser una cadena de texto' })
  monto: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsNotEmpty({ message: 'El ID del origen es requerido' })
  @IsUUID('4', { message: 'El ID del origen debe ser un UUID válido' })
  origenId: string;
}
