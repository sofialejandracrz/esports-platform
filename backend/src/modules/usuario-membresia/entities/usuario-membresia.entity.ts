import { MembresiaTipo } from "src/modules/membresia-tipo/entities/membresia-tipo.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario_membresias' })
export class UsuarioMembresia {
@PrimaryGeneratedColumn('uuid')
id: string;


@ManyToOne(() => Usuario, (u) => u.membresias, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@ManyToOne(() => MembresiaTipo)
@JoinColumn({ name: 'membresia_tipo_id' })
membresiaTipo: MembresiaTipo;


@Column({ name: 'fecha_inicio', type: 'date' })
fechaInicio: string;


@Column({ name: 'fecha_fin', type: 'date' })
fechaFin: string;


@Column({ name: 'activa', type: 'number', precision: 1, default: 1 })
activa: number;
}