import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateModoJuegoDto {
  @IsNotEmpty({ message: 'El ID del juego es requerido' })
  @IsUUID('4', { message: 'El ID del juego debe ser un UUID válido' })
  juegoId: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;
}
