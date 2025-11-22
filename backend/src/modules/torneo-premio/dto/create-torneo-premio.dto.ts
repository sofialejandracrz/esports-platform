import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateTorneoPremioDto {
  @IsNotEmpty({ message: 'El ID del torneo es requerido' })
  @IsUUID('4', { message: 'El ID del torneo debe ser un UUID válido' })
  torneoId: string;

  @IsOptional()
  @IsInt({ message: 'La cuota debe ser un número entero' })
  @IsPositive({ message: 'La cuota debe ser un número positivo' })
  cuota?: number;

  @IsOptional()
  @IsString({ message: 'El fondo total debe ser una cadena de texto' })
  fondoTotal?: string;

  @IsOptional()
  @IsString({ message: 'El fondo después de comisión debe ser una cadena de texto' })
  fondoDespuesComision?: string;

  @IsOptional()
  @IsString({ message: 'El porcentaje de comisión debe ser una cadena de texto' })
  comisionPorcentaje?: string;

  @IsOptional()
  @IsString({ message: 'El porcentaje del ganador 1 debe ser una cadena de texto' })
  ganador1Porcentaje?: string;

  @IsOptional()
  @IsString({ message: 'El porcentaje del ganador 2 debe ser una cadena de texto' })
  ganador2Porcentaje?: string;
}
