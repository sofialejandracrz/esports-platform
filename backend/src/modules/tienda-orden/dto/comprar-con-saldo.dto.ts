import { IsUUID, IsOptional, IsString, MinLength, MaxLength, IsObject } from 'class-validator';

export class ComprarConSaldoDto {
  @IsUUID()
  itemId: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    nuevo_nickname?: string;
    nickname_solicitado?: string;
    [key: string]: any;
  };
}
