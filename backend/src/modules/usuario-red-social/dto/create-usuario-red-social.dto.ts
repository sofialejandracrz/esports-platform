import { IsNotEmpty, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator';

export class CreateUsuarioRedSocialDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsNotEmpty({ message: 'La plataforma es requerida' })
  @IsString({ message: 'La plataforma debe ser texto' })
  @MaxLength(100, { message: 'La plataforma no puede exceder 100 caracteres' })
  plataforma: string;

  @IsNotEmpty({ message: 'El enlace es requerido' })
  @IsUrl({}, { message: 'El enlace debe ser una URL válida' })
  enlace: string;
}
