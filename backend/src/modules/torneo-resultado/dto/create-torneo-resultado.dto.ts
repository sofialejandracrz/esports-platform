import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class CreateTorneoResultadoDto {
  @IsNotEmpty()
  @IsUUID()
  torneoId: string;

  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  posicion: number;
}
