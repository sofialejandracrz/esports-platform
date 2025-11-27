import { IsUUID, IsString, IsOptional, IsEmail } from 'class-validator';

export class RegistrarPagoPaypalDto {
  @IsUUID()
  ordenId: string;

  @IsString()
  paypalOrderId: string;

  @IsOptional()
  @IsString()
  paypalCaptureId?: string;

  @IsOptional()
  @IsString()
  paypalPayerId?: string;

  @IsOptional()
  @IsEmail()
  paypalPayerEmail?: string;
}
