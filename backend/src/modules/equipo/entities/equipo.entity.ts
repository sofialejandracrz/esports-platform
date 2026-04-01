import { EquipoMiembro } from "src/modules/equipo-miembro/entities/equipo-miembro.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'equipo' })
export class Equipo {
@PrimaryGeneratedColumn('increment')
id: number;


@Column({ name: 'nombre', unique: true })
nombre: string;


@ManyToOne(() => Usuario)
@JoinColumn({ name: 'creado_por' })
creadoPor: Usuario;


@Column({ name: 'descripcion', type: 'clob', nullable: true })
descripcion?: string;


@Column({ name: 'avatar_url', nullable: true })
avatarUrl?: string;


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;


@OneToMany(() => EquipoMiembro, (m) => m.equipo)
miembros: EquipoMiembro[];
}