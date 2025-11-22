import { IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString, IsInt, IsBoolean, Min } from 'class-validator';

export class CreateTorneoDto {
  @IsNotEmpty()
  @IsUUID()
  anfitrionId: string;

  @IsNotEmpty()
  @IsUUID()
  juegoId: string;

  @IsNotEmpty()
  @IsUUID()
  plataformaId: string;

  @IsNotEmpty()
  @IsUUID()
  modoJuegoId: string;

  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fechaInicioRegistro?: string;

  @IsOptional()
  @IsDateString()
  fechaFinRegistro?: string;

  @IsOptional()
  @IsDateString()
  fechaInicioTorneo?: string;

  @IsNotEmpty()
  @IsUUID()
  regionId: string;

  @IsOptional()
  @IsString()
  tipoTorneo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  alMejorDe?: number;

  @IsOptional()
  @IsString()
  formato?: string;

  @IsOptional()
  @IsBoolean()
  cerrado?: boolean;

  @IsOptional()
  @IsString()
  reglas?: string;

  @IsOptional()
  @IsBoolean()
  jugadoresPcPermitidos?: boolean;

  @IsOptional()
  @IsBoolean()
  requiereTransmision?: boolean;

  @IsOptional()
  @IsBoolean()
  requiereCamara?: boolean;

  @IsNotEmpty()
  @IsUUID()
  tipoEntradaId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacidad?: number;
}
