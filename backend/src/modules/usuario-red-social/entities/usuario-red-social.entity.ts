import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario_red_social' })
export class UsuarioRedSocial {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Usuario, (u) => u.redesSociales, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@Column({ name: 'plataforma' })
plataforma: string; // e.g. 'discord','twitch'


@Column({ name: 'enlace' })
enlace: string;
}