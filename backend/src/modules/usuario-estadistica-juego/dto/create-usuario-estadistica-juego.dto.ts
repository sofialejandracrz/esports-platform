import { IsNumber,  IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateUsuarioEstadisticaJuegoDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber()
  usuarioId: string;

  @IsNotEmpty({ message: 'El ID del juego es requerido' })
  @IsNumber()
  juegoId: string;

  @IsOptional()
  @IsInt({ message: 'Las victorias deben ser un número entero' })
  @IsPositive({ message: 'Las victorias deben ser un número positivo' })
  victorias?: number;

  @IsOptional()
  @IsInt({ message: 'Las derrotas deben ser un número entero' })
  @IsPositive({ message: 'Las derrotas deben ser un número positivo' })
  derrotas?: number;

  @IsOptional()
  @IsInt({ message: 'Los empates deben ser un número entero' })
  @IsPositive({ message: 'Los empates deben ser un número positivo' })
  empates?: number;

  @IsOptional()
  @IsString({ message: 'El nivel de rango debe ser una cadena de texto' })
  nivelRango?: string;

  @IsOptional()
  @IsInt({ message: 'Las horas jugadas deben ser un número entero' })
  @IsPositive({ message: 'Las horas jugadas deben ser un número positivo' })
  horasJugadas?: number;
}
