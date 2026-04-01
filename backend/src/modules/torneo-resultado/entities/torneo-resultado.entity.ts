import { Torneo } from "src/modules/torneo/entities/torneo.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'torneo_resultados' })
export class TorneoResultado {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Torneo, (t) => t.resultados, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'torneo_id' })
torneo: Torneo;


@ManyToOne(() => Usuario)
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@Column({ name: 'posicion', type: 'int' })
posicion: number;
}