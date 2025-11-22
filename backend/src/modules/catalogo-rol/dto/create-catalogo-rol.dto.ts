import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoRolDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
