import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateModoJuegoDto {
  @IsNotEmpty()
  @IsUUID()
  juegoId: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
