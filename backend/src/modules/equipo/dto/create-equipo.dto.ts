import { IsNotEmpty, IsString, IsOptional, IsUrl, IsUUID } from 'class-validator';

export class CreateEquipoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsUUID()
  creadoPorId: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
