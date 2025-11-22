import { IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateTorneoRedDto {
  @IsNotEmpty({ message: 'El ID del torneo es requerido' })
  @IsUUID('4', { message: 'El ID del torneo debe ser un UUID válido' })
  torneoId: string;

  @IsNotEmpty({ message: 'La plataforma es requerida' })
  @IsString({ message: 'La plataforma debe ser una cadena de texto' })
  plataforma: string;

  @IsNotEmpty({ message: 'La URL es requerida' })
  @IsUrl({}, { message: 'La URL debe ser válida' })
  url: string;
}
