import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUsuarioCuentaJuegoDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsUUID()
  plataformaJuegoId: string;

  @IsNotEmpty()
  @IsString()
  identificador: string;
}
