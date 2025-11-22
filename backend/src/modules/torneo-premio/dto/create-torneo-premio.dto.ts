import { IsNotEmpty, IsUUID, IsOptional, IsInt, IsString, Min } from 'class-validator';

export class CreateTorneoPremioDto {
  @IsNotEmpty()
  @IsUUID()
  torneoId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  cuota?: number;

  @IsOptional()
  @IsString()
  fondoTotal?: string;

  @IsOptional()
  @IsString()
  fondoDespuesComision?: string;

  @IsOptional()
  @IsString()
  comisionPorcentaje?: string;

  @IsOptional()
  @IsString()
  ganador1Porcentaje?: string;

  @IsOptional()
  @IsString()
  ganador2Porcentaje?: string;
}
