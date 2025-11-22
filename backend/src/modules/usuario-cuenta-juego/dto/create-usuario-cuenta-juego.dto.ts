import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUsuarioCuentaJuegoDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsNotEmpty({ message: 'El ID de la plataforma de juego es requerido' })
  @IsUUID('4', { message: 'El ID de la plataforma de juego debe ser un UUID válido' })
  plataformaJuegoId: string;

  @IsNotEmpty({ message: 'El identificador es requerido' })
  @IsString({ message: 'El identificador debe ser una cadena de texto' })
  identificador: string;
}
