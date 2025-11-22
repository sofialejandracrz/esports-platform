import { IsNotEmpty, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateTorneoInscripcionDto {
  @IsNotEmpty()
  @IsUUID()
  torneoId: string;

  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsNotEmpty()
  @IsUUID()
  estadoId: string;
}
