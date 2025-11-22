import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoTipoEntradaDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
