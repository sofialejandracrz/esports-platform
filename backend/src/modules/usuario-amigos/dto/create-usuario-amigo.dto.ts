import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUsuarioAmigoDto {
  @IsNotEmpty()
  @IsUUID()
  usuario1Id: string;

  @IsNotEmpty()
  @IsUUID()
  usuario2Id: string;

  @IsNotEmpty()
  @IsUUID()
  estadoId: string;
}
