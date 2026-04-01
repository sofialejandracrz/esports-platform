import { IsNumber,  IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateTorneoRedDto {
  @IsNotEmpty({ message: 'El ID del torneo es requerido' })
  @IsNumber()
  torneoId: string;

  @IsNotEmpty({ message: 'La plataforma es requerida' })
  @IsString({ message: 'La plataforma debe ser una cadena de texto' })
  plataforma: string;

  @IsNotEmpty({ message: 'La URL es requerida' })
  @IsUrl({}, { message: 'La URL debe ser válida' })
  url: string;
}
