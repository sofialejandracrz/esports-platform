import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoOrigenTransaccionDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
