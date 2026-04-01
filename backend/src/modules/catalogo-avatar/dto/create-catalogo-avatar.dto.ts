import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCatalogoAvatarDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    seed: string;

    @IsString()
    @IsOptional()
    categoria?: string;

    @IsNumber()
    @IsOptional()
    disponible?: number; // 1 = true, 0 = false (Oracle compatibility)

    @IsNumber()
    @IsOptional()
    premium?: number; // 1 = true, 0 = false (Oracle compatibility)
}
