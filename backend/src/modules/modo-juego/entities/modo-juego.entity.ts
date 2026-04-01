import { Juego } from "src/modules/juego/entities/juego.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'modo_juego' })
export class ModoJuego {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Juego, (j) => j.modos, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'juego_id' })
juego: Juego;


@Column({ name: 'nombre' })
nombre: string;


@Column({ name: 'descripcion', type: 'clob', nullable: true })
descripcion?: string;
}