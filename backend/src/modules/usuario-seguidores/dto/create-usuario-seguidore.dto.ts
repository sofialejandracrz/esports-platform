import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateUsuarioSeguidoreDto {
  @IsNotEmpty({ message: 'El ID del seguidor es requerido' })
  @IsUUID('4', { message: 'El ID del seguidor debe ser un UUID válido' })
  seguidorId: string;

  @IsNotEmpty({ message: 'El ID del seguido es requerido' })
  @IsUUID('4', { message: 'El ID del seguido debe ser un UUID válido' })
  seguidoId: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de creación debe tener formato ISO 8601' })
  creadoEn?: string;
}
