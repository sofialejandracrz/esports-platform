import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_plataforma' })
export class CatalogoPlataforma {
    @PrimaryGeneratedColumn('increment')
    id: number;


    @Column({ name: 'valor', unique: true })
    valor: string; // e.g. 'PlayStation','Xbox','PC','Movil','Multiplataforma'


    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;
}