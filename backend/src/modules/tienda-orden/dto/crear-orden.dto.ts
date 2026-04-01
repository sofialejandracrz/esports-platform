import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, MaxLength, IsObject } from 'class-validator';

export class CrearOrdenDto {
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsObject()
  metadata?: {
    nuevo_nickname?: string;
    nickname_solicitado?: string;
    [key: string]: any;
  };
}

export class CrearOrdenConNicknameDto extends CrearOrdenDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  nuevoNickname: string;
}

export class ReclamarNicknameDto extends CrearOrdenDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  nicknameSolicitado: string;
}
