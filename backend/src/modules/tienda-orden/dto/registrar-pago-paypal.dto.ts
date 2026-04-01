import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEmail } from 'class-validator';

export class RegistrarPagoPaypalDto {
  @IsNotEmpty()
  @IsNumber()
  ordenId: number;

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
