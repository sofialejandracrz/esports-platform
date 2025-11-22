import { IsNotEmpty, IsUUID, IsOptional, IsInt, IsString, Min } from 'class-validator';

export class CreateUsuarioEstadisticaJuegoDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsUUID()
  juegoId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  victorias?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  derrotas?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  empates?: number;

  @IsOptional()
  @IsString()
  nivelRango?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  horasJugadas?: number;
}
