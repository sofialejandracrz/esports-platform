import { Equipo } from "src/modules/equipo/entities/equipo.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'equipo_miembros' })
export class EquipoMiembro {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Equipo, (e) => e.miembros, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'equipo_id' })
equipo: Equipo;


@ManyToOne(() => Usuario)
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@Column({ name: 'rol', type: 'varchar', default: 'miembro' })
rol: string;


@CreateDateColumn({ name: 'joined_at' })
joinedAt: Date;
}