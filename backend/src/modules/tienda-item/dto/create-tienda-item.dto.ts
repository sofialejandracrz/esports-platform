import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTiendaItemDto {
  @IsNotEmpty()
  @IsUUID()
  tipoId: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsString()
  precio: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditosOtorgados?: number;

  @IsOptional()
  metadata?: any;
}
