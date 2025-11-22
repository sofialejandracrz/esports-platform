import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogoRegionDto {
  @IsNotEmpty()
  @IsString()
  valor: string;
}
