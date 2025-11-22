import { IsNotEmpty, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateUsuarioSeguidoreDto {
  @IsNotEmpty()
  @IsUUID()
  seguidorId: string;

  @IsNotEmpty()
  @IsUUID()
  seguidoId: string;

  @IsOptional()
  @IsDateString()
  creadoEn?: string;
}
