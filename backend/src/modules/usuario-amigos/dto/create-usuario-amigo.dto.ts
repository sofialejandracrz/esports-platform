import { IsNumber,  IsNotEmpty } from 'class-validator';

export class CreateUsuarioAmigoDto {
  @IsNotEmpty({ message: 'El ID del usuario 1 es requerido' })
  @IsNumber()
  usuario1Id: string;

  @IsNotEmpty({ message: 'El ID del usuario 2 es requerido' })
  @IsNumber()
  usuario2Id: string;

  @IsNotEmpty({ message: 'El ID del estado es requerido' })
  @IsNumber()
  estadoId: string;
}
