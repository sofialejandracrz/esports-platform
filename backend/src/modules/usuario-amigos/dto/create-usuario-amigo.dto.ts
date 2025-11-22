import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUsuarioAmigoDto {
  @IsNotEmpty({ message: 'El ID del usuario 1 es requerido' })
  @IsUUID('4', { message: 'El ID del usuario 1 debe ser un UUID válido' })
  usuario1Id: string;

  @IsNotEmpty({ message: 'El ID del usuario 2 es requerido' })
  @IsUUID('4', { message: 'El ID del usuario 2 debe ser un UUID válido' })
  usuario2Id: string;

  @IsNotEmpty({ message: 'El ID del estado es requerido' })
  @IsUUID('4', { message: 'El ID del estado debe ser un UUID válido' })
  estadoId: string;
}
