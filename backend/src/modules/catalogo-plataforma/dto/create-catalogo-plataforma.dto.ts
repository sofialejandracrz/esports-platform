import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoPlataformaDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
