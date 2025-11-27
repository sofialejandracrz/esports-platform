import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCatalogoTipoTorneoDto {
  @IsNotEmpty({ message: 'El valor es requerido' })
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  valor: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsNotEmpty({ message: 'El tipo de trofeo es requerido' })
  @IsString({ message: 'El tipo de trofeo debe ser una cadena de texto' })
  tipoTrofeo: string;
}
