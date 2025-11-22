import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateEquipoMiembroDto {
  @IsNotEmpty()
  @IsUUID()
  equipoId: string;

  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsOptional()
  @IsString()
  rol?: string;
}
