import { IsNumber,  IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEquipoMiembroDto {
  @IsNotEmpty({ message: 'El ID del equipo es requerido' })
  @IsNumber()
  equipoId: string;

  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber()
  usuarioId: string;

  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  rol?: string;
}
