import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoEstadoInscripcionDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
