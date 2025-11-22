import { IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateTorneoRedDto {
  @IsNotEmpty()
  @IsUUID()
  torneoId: string;

  @IsNotEmpty()
  @IsString()
  plataforma: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
