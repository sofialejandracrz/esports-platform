import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoTransaccionTipoDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
