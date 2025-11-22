import { CatalogoRol } from "src/modules/catalogo-rol/entities/catalogo-rol.entity";
import { Persona } from "src/modules/persona/entities/persona.entity";
import { Transaccion } from "src/modules/transaccion/entities/transaccion.entity";
import { UsuarioAmigos } from "src/modules/usuario-amigos/entities/usuario-amigo.entity";
import { UsuarioCuentaJuego } from "src/modules/usuario-cuenta-juego/entities/usuario-cuenta-juego.entity";
import { UsuarioMembresia } from "src/modules/usuario-membresia/entities/usuario-membresia.entity";
import { UsuarioRedSocial } from "src/modules/usuario-red-social/entities/usuario-red-social.entity";
import { UsuarioSeguidores } from "src/modules/usuario-seguidores/entities/usuario-seguidore.entity";
import { UsuarioTrofeo } from "src/modules/usuario-trofeo/entities/usuario-trofeo.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'usuario' })
export class Usuario {
@PrimaryGeneratedColumn('uuid', { name: 'id' })
id: string;


@OneToOne(() => Persona, { cascade: true })
@JoinColumn({ name: 'persona_id' })
persona: Persona;


@Index({ unique: true })
@Column({ name: 'nickname', unique: true })
nickname: string;


@ManyToOne(() => CatalogoRol, { nullable: false })
@JoinColumn({ name: 'rol_id' })
rol: CatalogoRol;


@Column({ name: 'password', select: false })
password: string;


@Column({ name: 'estado', type: 'varchar', length: 50, default: 'activo' })
estado: string; // 'activo', 'suspendido', 'baneado'


@Column({ name: 'ultima_conexion', type: 'timestamp', nullable: true })
ultimaConexion?: Date;


@Column({ name: 'xp', type: 'int', default: 0 })
xp: number;


@Column({ name: 'saldo', type: 'numeric', precision: 12, scale: 2, default: 0 })
saldo: string;


@Column({ name: 'creditos', type: 'int', default: 0 })
creditos: number;


@Column({ name: 'foto_perfil', nullable: true })
fotoPerfil?: string;


@Column({ name: 'biografia', type: 'varchar', length: 300, nullable: true })
biografia?: string;


@Column({ name: 'desafios_habilitados', type: 'boolean', default: true })
desafiosHabilitados: boolean;


@Column({ name: 'pais', nullable: true })
pais?: string;


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;


@UpdateDateColumn({ name: 'actualizado_en' })
actualizadoEn: Date;


@DeleteDateColumn({ name: 'deleted_at', nullable: true })
deletedAt?: Date;


/* Relations */
@OneToMany(() => UsuarioRedSocial, (r) => r.usuario)
redesSociales: UsuarioRedSocial[];


@OneToMany(() => UsuarioCuentaJuego, (c) => c.usuario)
cuentasJuego: UsuarioCuentaJuego[];


@OneToMany(() => UsuarioAmigos, (a) => a.usuario1)
amigosSolicitudes: UsuarioAmigos[];


@OneToMany(() => UsuarioAmigos, (a) => a.usuario2)
amigosRecibidos: UsuarioAmigos[];


@OneToMany(() => UsuarioSeguidores, (s) => s.seguidor)
siguiendo: UsuarioSeguidores[];


@OneToMany(() => UsuarioSeguidores, (s) => s.seguido)
seguidores: UsuarioSeguidores[];


@OneToMany(() => UsuarioMembresia, (m) => m.usuario)
membresias: UsuarioMembresia[];


@OneToMany(() => UsuarioTrofeo, (t) => t.usuario)
trofeos: UsuarioTrofeo[];


@OneToMany(() => Transaccion, (t) => t.usuario)
transacciones: Transaccion[];

    logrosUsuario: any;

}