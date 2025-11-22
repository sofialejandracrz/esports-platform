import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCatalogoGeneroDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  valor: string;
}
