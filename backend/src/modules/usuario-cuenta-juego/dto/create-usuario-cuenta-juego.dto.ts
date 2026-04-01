import { IsNumber,  IsNotEmpty, IsString } from 'class-validator';

export class CreateUsuarioCuentaJuegoDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber()
  usuarioId: string;

  @IsNotEmpty({ message: 'El ID de la plataforma de juego es requerido' })
  @IsNumber()
  plataformaJuegoId: string;

  @IsNotEmpty({ message: 'El identificador es requerido' })
  @IsString({ message: 'El identificador debe ser una cadena de texto' })
  identificador: string;
}
