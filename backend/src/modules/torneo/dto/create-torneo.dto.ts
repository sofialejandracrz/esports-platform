import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateTorneoDto {
  @IsNotEmpty({ message: 'El ID del anfitrión es requerido' })
  @IsUUID('4', { message: 'El ID del anfitrión debe ser un UUID válido' })
  anfitrionId: string;

  @IsNotEmpty({ message: 'El ID del juego es requerido' })
  @IsUUID('4', { message: 'El ID del juego debe ser un UUID válido' })
  juegoId: string;

  @IsNotEmpty({ message: 'El ID de la plataforma es requerido' })
  @IsUUID('4', { message: 'El ID de la plataforma debe ser un UUID válido' })
  plataformaId: string;

  @IsNotEmpty({ message: 'El ID del modo de juego es requerido' })
  @IsUUID('4', { message: 'El ID del modo de juego debe ser un UUID válido' })
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
  @IsUUID('4', { message: 'El ID de la región debe ser un UUID válido' })
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
  @IsBoolean({ message: 'Cerrado debe ser un valor booleano' })
  cerrado?: boolean;

  @IsOptional()
  @IsString({ message: 'Las reglas deben ser una cadena de texto' })
  reglas?: string;

  @IsOptional()
  @IsBoolean({ message: 'Jugadores PC permitidos debe ser un valor booleano' })
  jugadoresPcPermitidos?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Requiere transmisión debe ser un valor booleano' })
  requiereTransmision?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Requiere cámara debe ser un valor booleano' })
  requiereCamara?: boolean;

  @IsNotEmpty({ message: 'El ID del tipo de entrada es requerido' })
  @IsUUID('4', { message: 'El ID del tipo de entrada debe ser un UUID válido' })
  tipoEntradaId: string;

  @IsOptional()
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @IsPositive({ message: 'La capacidad debe ser un número positivo' })
  capacidad?: number;
}
