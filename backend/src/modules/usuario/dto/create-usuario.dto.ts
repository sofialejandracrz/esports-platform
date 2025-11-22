import { IsNotEmpty, IsString, IsUUID, IsOptional, IsInt, IsBoolean, MaxLength, Min } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsUUID()
  personaId: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsUUID()
  rolId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  xp?: number;

  @IsOptional()
  @IsString()
  saldo?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  creditos?: number;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  biografia?: string;

  @IsOptional()
  @IsBoolean()
  desafiosHabilitados?: boolean;

  @IsOptional()
  @IsString()
  pais?: string;
}
