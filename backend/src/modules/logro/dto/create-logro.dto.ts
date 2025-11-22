import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUrl, Min } from 'class-validator';

export class CreateLogroDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  puntos?: number;

  @IsOptional()
  @IsUrl()
  iconoUrl?: string;
}
