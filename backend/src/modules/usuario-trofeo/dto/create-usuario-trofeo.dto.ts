import { IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateUsuarioTrofeoDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsOptional()
  @IsUUID()
  torneoId?: string;

  @IsNotEmpty()
  @IsString()
  tipoTrofeo: string;

  @IsOptional()
  @IsDateString()
  ganadoEn?: string;
}
