import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class ConfirmarCompraDto {
  @IsNotEmpty()
  @IsNumber()
  ordenId: number;

  @IsOptional()
  @IsString()
  paypalCaptureId?: string;
}
