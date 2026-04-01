import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario_seguidores' })
export class UsuarioSeguidores {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Usuario, (u) => u.siguiendo, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'seguidor_id' })
seguidor: Usuario;


@ManyToOne(() => Usuario, (u) => u.seguidores, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'seguido_id' })
seguido: Usuario;


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;
}