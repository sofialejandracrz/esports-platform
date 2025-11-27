import { IsString, MinLength, MaxLength } from 'class-validator';

export class VerificarNicknameDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  nickname: string;
}
