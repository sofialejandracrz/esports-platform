import { IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateUsuarioRedSocialDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsString()
  plataforma: string;

  @IsNotEmpty()
  @IsUrl()
  enlace: string;
}
