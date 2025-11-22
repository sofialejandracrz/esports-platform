import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateJuegoDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsOptional()
  @IsArray({ message: 'Las plataformas deben ser un array' })
  @IsUUID('4', { each: true, message: 'Cada ID de plataforma debe ser un UUID válido' })
  plataformaIds?: string[];
}
