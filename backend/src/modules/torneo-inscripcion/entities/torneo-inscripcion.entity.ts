import { CatalogoEstadoInscripcion } from "src/modules/catalogo-estado-inscripcion/entities/catalogo-estado-inscripcion.entity";
import { Torneo } from "src/modules/torneo/entities/torneo.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'torneo_inscripcion' })
export class TorneoInscripcion {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Torneo, (t) => t.inscripciones, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'torneo_id' })
torneo: Torneo;


@ManyToOne(() => Usuario, { nullable: false })
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@Column({ name: 'fecha', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
fecha: Date;


@ManyToOne(() => CatalogoEstadoInscripcion, { nullable: false })
@JoinColumn({ name: 'estado_id' })
estado: CatalogoEstadoInscripcion;
}