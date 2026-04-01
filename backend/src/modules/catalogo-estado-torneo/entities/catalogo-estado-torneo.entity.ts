import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_estado_torneo' })
export class CatalogoEstadoTorneo {
    @PrimaryGeneratedColumn('increment')
    id: number;


    @Column({ name: 'valor', unique: true })
    valor: string; // e.g. 'proximamente','en_curso','terminado'


    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;
}