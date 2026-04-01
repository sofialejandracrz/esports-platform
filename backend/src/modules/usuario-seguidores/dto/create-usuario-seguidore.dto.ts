import { IsNumber,  IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUsuarioSeguidoreDto {
  @IsNotEmpty({ message: 'El ID del seguidor es requerido' })
  @IsNumber()
  seguidorId: string;

  @IsNotEmpty({ message: 'El ID del seguido es requerido' })
  @IsNumber()
  seguidoId: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de creación debe tener formato ISO 8601' })
  creadoEn?: string;
}
