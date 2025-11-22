import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateTiendaItemDto {
  @IsNotEmpty({ message: 'El ID del tipo es requerido' })
  @IsUUID('4', { message: 'El ID del tipo debe ser un UUID válido' })
  tipoId: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsString({ message: 'El precio debe ser una cadena de texto' })
  precio: string;

  @IsOptional()
  @IsInt({ message: 'Los créditos otorgados deben ser un número entero' })
  @IsPositive({ message: 'Los créditos otorgados deben ser un número positivo' })
  creditosOtorgados?: number;

  @IsOptional()
  metadata?: any;
}
