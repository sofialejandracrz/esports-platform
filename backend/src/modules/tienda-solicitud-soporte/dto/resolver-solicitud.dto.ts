import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsIn } from 'class-validator';

export class ResolverSolicitudDto {
  @IsNotEmpty()
  @IsNumber()
  solicitudId: number;

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
