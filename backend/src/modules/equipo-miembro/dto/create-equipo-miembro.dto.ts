import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEquipoMiembroDto {
  @IsNotEmpty({ message: 'El ID del equipo es requerido' })
  @IsUUID('4', { message: 'El ID del equipo debe ser un UUID válido' })
  equipoId: string;

  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  rol?: string;
}
