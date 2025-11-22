import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class CreateTorneoResultadoDto {
  @IsNotEmpty({ message: 'El ID del torneo es requerido' })
  @IsUUID('4', { message: 'El ID del torneo debe ser un UUID válido' })
  torneoId: string;

  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsNotEmpty({ message: 'La posición es requerida' })
  @IsInt({ message: 'La posición debe ser un número entero' })
  @IsPositive({ message: 'La posición debe ser un número positivo' })
  posicion: number;
}
