import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoTipoItemDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
