import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateMembresiaTipoDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsString({ message: 'El precio debe ser una cadena de texto' })
  precio: string;

  @IsNotEmpty({ message: 'La duración en días es requerida' })
  @IsInt({ message: 'La duración debe ser un número entero' })
  @IsPositive({ message: 'La duración debe ser un número positivo' })
  duracionDias: number;

  @IsOptional()
  @IsString({ message: 'Los beneficios deben ser una cadena de texto' })
  beneficios?: string;
}
