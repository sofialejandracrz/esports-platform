import { IsUUID, IsString, IsOptional } from 'class-validator';

export class ConfirmarCompraDto {
  @IsUUID()
  ordenId: string;

  @IsOptional()
  @IsString()
  paypalCaptureId?: string;
}
