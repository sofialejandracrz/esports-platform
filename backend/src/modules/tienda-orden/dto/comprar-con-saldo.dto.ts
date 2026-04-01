import { IsNotEmpty, IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class ComprarConSaldoDto {
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
