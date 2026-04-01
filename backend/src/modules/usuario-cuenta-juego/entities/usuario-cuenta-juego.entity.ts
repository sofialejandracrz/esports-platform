import { CatalogoPlataforma } from "src/modules/catalogo-plataforma/entities/catalogo-plataforma.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario_cuenta_juego' })
export class UsuarioCuentaJuego {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Usuario, (u) => u.cuentasJuego, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@ManyToOne(() => CatalogoPlataforma, { nullable: false })
@JoinColumn({ name: 'plataforma_juego_id' })
plataformaJuego: CatalogoPlataforma;


@Column({ name: 'identificador' })
identificador: string;
}