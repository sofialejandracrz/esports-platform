import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateTransaccionDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsUUID()
  tipoId: string;

  @IsNotEmpty()
  @IsString()
  monto: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsUUID()
  origenId: string;
}
