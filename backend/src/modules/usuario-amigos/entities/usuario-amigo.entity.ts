import { CatalogoEstadoAmistad } from "src/modules/catalogo-estado-amistad/entities/catalogo-estado-amistad.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario_amigos' })
export class UsuarioAmigos {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Usuario, (u) => u.amigosSolicitudes, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'usuario1_id' })
usuario1: Usuario;


@ManyToOne(() => Usuario, (u) => u.amigosRecibidos, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'usuario2_id' })
usuario2: Usuario;


@ManyToOne(() => CatalogoEstadoAmistad, { nullable: false })
@JoinColumn({ name: 'estado_id' })
estado: CatalogoEstadoAmistad;


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;
}