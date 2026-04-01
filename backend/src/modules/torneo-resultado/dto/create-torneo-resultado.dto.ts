import { IsNumber,  IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateTorneoResultadoDto {
  @IsNotEmpty({ message: 'El ID del torneo es requerido' })
  @IsNumber()
  torneoId: string;

  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber()
  usuarioId: string;

  @IsNotEmpty({ message: 'La posición es requerida' })
  @IsInt({ message: 'La posición debe ser un número entero' })
  @IsPositive({ message: 'La posición debe ser un número positivo' })
  posicion: number;
}
