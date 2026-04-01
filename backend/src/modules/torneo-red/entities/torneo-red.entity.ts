import { Torneo } from "src/modules/torneo/entities/torneo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'torneo_redes' })
export class TorneoRed {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Torneo, (t) => t.redes, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'torneo_id' })
torneo: Torneo;


@Column({ name: 'plataforma' })
plataforma: string;


@Column({ name: 'url' })
url: string;
}