import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePersonaDto {
  @IsNotEmpty({ message: 'El primer nombre es requerido' })
  @IsString({ message: 'El primer nombre debe ser una cadena de texto' })
  pNombre: string;

  @IsOptional()
  @IsString({ message: 'El segundo nombre debe ser una cadena de texto' })
  sNombre?: string;

  @IsNotEmpty({ message: 'El primer apellido es requerido' })
  @IsString({ message: 'El primer apellido debe ser una cadena de texto' })
  pApellido: string;

  @IsOptional()
  @IsString({ message: 'El segundo apellido debe ser una cadena de texto' })
  sApellido?: string;

  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail({}, { message: 'El correo debe ser válido' })
  correo: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener formato YYYY-MM-DD' })
  fechaNacimiento?: string;

  @IsOptional()
  @IsUUID('4', { message: 'El ID del género debe ser un UUID válido' })
  generoId?: string;

  @IsOptional()
  @IsString({ message: 'El timezone debe ser una cadena de texto' })
  timezone?: string;
}
