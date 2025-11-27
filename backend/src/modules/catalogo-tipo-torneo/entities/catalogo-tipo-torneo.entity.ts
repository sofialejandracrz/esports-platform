import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_tipo_torneo' })
export class CatalogoTipoTorneo {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'valor', unique: true })
    valor: string; // e.g. 'eliminacion_simple', 'eliminacion_doble', 'todos_contra_todos', 'grupos', 'suizo'

    @Column({ name: 'descripcion', type: 'text', nullable: true })
    descripcion?: string;

    @Column({ name: 'tipo_trofeo' })
    tipoTrofeo: string; // Tipo de trofeo que otorga este tipo de torneo

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;
}
