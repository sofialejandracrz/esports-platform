import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEquipoDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El ID del creador es requerido' })
  @IsUUID('4', { message: 'El ID del creador debe ser un UUID válido' })
  creadoPorId: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsOptional()
  @IsString({ message: 'La URL del avatar debe ser una cadena de texto' })
  avatarUrl?: string;
}
