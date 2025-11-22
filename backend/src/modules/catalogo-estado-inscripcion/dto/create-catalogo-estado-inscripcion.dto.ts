import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoEstadoInscripcionDto {
  @IsNotEmpty({ message: 'El valor es requerido' })
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  valor: string;
}
