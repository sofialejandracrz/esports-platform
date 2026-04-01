import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'catalogo_genero' })
export class CatalogoGenero {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'valor', unique: true })
    valor: string; // e.g. 'masculino', 'femenino', 'otro'

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;
}
