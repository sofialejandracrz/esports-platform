import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El ID de la persona es requerido' })
  @IsUUID('4', { message: 'El ID de la persona debe ser un UUID válido' })
  personaId: string;

  @IsNotEmpty({ message: 'El nickname es requerido' })
  @IsString({ message: 'El nickname debe ser una cadena de texto' })
  nickname: string;

  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  @IsUUID('4', { message: 'El ID del rol debe ser un UUID válido' })
  rolId: string;

  @IsOptional()
  @IsInt({ message: 'La experiencia debe ser un número entero' })
  @IsPositive({ message: 'La experiencia debe ser un número positivo' })
  xp?: number;

  @IsOptional()
  @IsString({ message: 'El saldo debe ser una cadena de texto' })
  saldo?: string;

  @IsOptional()
  @IsInt({ message: 'Los créditos deben ser un número entero' })
  @IsPositive({ message: 'Los créditos deben ser un número positivo' })
  creditos?: number;

  @IsOptional()
  @IsUrl({}, { message: 'La foto de perfil debe ser una URL válida' })
  fotoPerfil?: string;

  @IsOptional()
  @IsString({ message: 'La biografía debe ser una cadena de texto' })
  @MaxLength(300, { message: 'La biografía no puede exceder 300 caracteres' })
  biografia?: string;

  @IsOptional()
  @IsBoolean({ message: 'Desafíos habilitados debe ser un valor booleano' })
  desafiosHabilitados?: boolean;

  @IsOptional()
  @IsString({ message: 'El país debe ser una cadena de texto' })
  pais?: string;
}
