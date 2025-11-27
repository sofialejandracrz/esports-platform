import { IsUUID, IsBoolean, IsOptional, IsString, IsIn } from 'class-validator';

export class ResolverSolicitudDto {
  @IsUUID()
  solicitudId: string;

  @IsBoolean()
  aprobar: boolean;

  @IsOptional()
  @IsString()
  notas?: string;
}

export class ObtenerSolicitudesDto {
  @IsOptional()
  @IsIn(['pendiente', 'en_revision', 'aprobado', 'rechazado'])
  estado?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}
