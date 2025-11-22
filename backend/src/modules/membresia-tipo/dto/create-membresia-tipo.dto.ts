import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMembresiaTipoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  precio: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duracionDias: number;

  @IsOptional()
  @IsString()
  beneficios?: string;
}
