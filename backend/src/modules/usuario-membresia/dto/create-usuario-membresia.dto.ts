import { IsNotEmpty, IsUUID, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUsuarioMembresiaDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsUUID()
  membresiaTipoId: string;

  @IsNotEmpty()
  @IsDateString()
  fechaInicio: string;

  @IsNotEmpty()
  @IsDateString()
  fechaFin: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
