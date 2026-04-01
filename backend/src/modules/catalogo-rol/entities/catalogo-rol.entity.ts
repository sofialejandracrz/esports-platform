import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_rol' })
export class CatalogoRol {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'valor', unique: true })
    valor: string; // e.g. 'usuario','admin'

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;
}