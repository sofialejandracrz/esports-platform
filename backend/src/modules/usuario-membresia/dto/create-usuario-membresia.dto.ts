import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateUsuarioMembresiaDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsNotEmpty({ message: 'El ID del tipo de membresía es requerido' })
  @IsUUID('4', { message: 'El ID del tipo de membresía debe ser un UUID válido' })
  membresiaTipoId: string;

  @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato ISO 8601' })
  fechaInicio: string;

  @IsNotEmpty({ message: 'La fecha de fin es requerida' })
  @IsDateString({}, { message: 'La fecha de fin debe tener formato ISO 8601' })
  fechaFin: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo activa debe ser booleano' })
  activa?: boolean;
}
