import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoEstadoAmistadDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
