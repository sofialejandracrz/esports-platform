import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoEstadoTorneoDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
