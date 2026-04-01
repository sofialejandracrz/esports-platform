import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateUsuarioMembresiaDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber()
  usuarioId: string;

  @IsNotEmpty({ message: 'El ID del tipo de membresía es requerido' })
  @IsNumber()
  membresiaTipoId: string;

  @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato ISO 8601' })
  fechaInicio: string;

  @IsNotEmpty({ message: 'La fecha de fin es requerida' })
  @IsDateString({}, { message: 'La fecha de fin debe tener formato ISO 8601' })
  fechaFin: string;

  @IsOptional()
  @IsNumber()
  activa?: number; // 1 = true, 0 = false (Oracle compatibility)
}
