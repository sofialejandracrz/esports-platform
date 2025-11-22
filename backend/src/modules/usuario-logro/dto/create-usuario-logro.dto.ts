import { IsNotEmpty, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateUsuarioLogroDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsUUID()
  logroId: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;
}
