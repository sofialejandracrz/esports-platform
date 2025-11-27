import { Torneo } from "src/modules/torneo/entities/torneo.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'torneo_premios' })
export class TorneoPremio {
@PrimaryGeneratedColumn('uuid')
id: string;


@OneToOne(() => Torneo, (t) => t.premio, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'torneo_id' })
torneo: Torneo;


@Column({ name: 'cuota', type: 'int', nullable: true })
cuota?: number; // en creditos por jugador


@Column({ name: 'fondo_total', type: 'numeric', precision: 12, scale: 2, default: 0 })
fondoTotal: string;


@Column({ name: 'fondo_despues_comision', type: 'numeric', precision: 12, scale: 2, default: 0 })
fondoDespuesComision: string;


@Column({ name: 'comision_porcentaje', type: 'numeric', precision: 5, scale: 2, default: 0 })
comisionPorcentaje: string;


@Column({ name: 'comision_total', type: 'numeric', precision: 12, scale: 2, default: 0 })
comisionTotal: string;


@Column({ name: 'ganador1_porcentaje', type: 'numeric', precision: 5, scale: 2, default: 0 })
ganador1Porcentaje: string;


@Column({ name: 'ganador2_porcentaje', type: 'numeric', precision: 5, scale: 2, default: 0 })
ganador2Porcentaje: string;
}