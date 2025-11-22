import { IsNotEmpty, IsString, IsEmail, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreatePersonaDto {
  @IsNotEmpty()
  @IsString()
  pNombre: string;

  @IsOptional()
  @IsString()
  sNombre?: string;

  @IsNotEmpty()
  @IsString()
  pApellido: string;

  @IsOptional()
  @IsString()
  sApellido?: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsUUID()
  generoId?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}
