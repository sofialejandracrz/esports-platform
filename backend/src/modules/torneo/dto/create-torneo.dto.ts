import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateTorneoDto {
  @IsNotEmpty({ message: 'El ID del anfitrión es requerido' })
  @IsNumber()
  anfitrionId: string;

  @IsNotEmpty({ message: 'El ID del juego es requerido' })
  @IsNumber()
  juegoId: string;

  @IsNotEmpty({ message: 'El ID de la plataforma es requerido' })
  @IsNumber()
  plataformaId: string;

  @IsNotEmpty({ message: 'El ID del modo de juego es requerido' })
  @IsNumber()
  modoJuegoId: string;

  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio de registro debe tener formato ISO 8601' })
  fechaInicioRegistro?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin de registro debe tener formato ISO 8601' })
  fechaFinRegistro?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio del torneo debe tener formato ISO 8601' })
  fechaInicioTorneo?: string;

  @IsNotEmpty({ message: 'El ID de la región es requerido' })
  @IsNumber()
  regionId: string;

  @IsOptional()
  @IsString({ message: 'El tipo de torneo debe ser una cadena de texto' })
  tipoTorneo?: string;

  @IsOptional()
  @IsInt({ message: 'Al mejor de debe ser un número entero' })
  @IsPositive({ message: 'Al mejor de debe ser un número positivo' })
  alMejorDe?: number;

  @IsOptional()
  @IsString({ message: 'El formato debe ser una cadena de texto' })
  formato?: string;

  @IsOptional()
  @IsNumber()
  cerrado?: number;

  @IsOptional()
  @IsString({ message: 'Las reglas deben ser una cadena de texto' })
  reglas?: string;

  @IsOptional()
  @IsNumber()
  jugadoresPcPermitidos?: number;

  @IsOptional()
  @IsNumber()
  requiereTransmision?: number;

  @IsOptional()
  @IsNumber()
  requiereCamara?: number;

  @IsNotEmpty({ message: 'El ID del tipo de entrada es requerido' })
  @IsNumber()
  tipoEntradaId: string;

  @IsOptional()
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @IsPositive({ message: 'La capacidad debe ser un número positivo' })
  capacidad?: number;
}
