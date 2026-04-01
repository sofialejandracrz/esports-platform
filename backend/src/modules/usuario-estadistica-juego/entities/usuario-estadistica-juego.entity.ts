import { Juego } from "src/modules/juego/entities/juego.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'usuario_estadisticas_juego' })
export class UsuarioEstadisticaJuego {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Usuario)
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@ManyToOne(() => Juego)
@JoinColumn({ name: 'juego_id' })
juego: Juego;


@Column({ name: 'victorias', type: 'int', default: 0 })
victorias: number;


@Column({ name: 'derrotas', type: 'int', default: 0 })
derrotas: number;


@Column({ name: 'empates', type: 'int', default: 0 })
empates: number;


@Column({ name: 'nivel_rango', nullable: true })
nivelRango?: string;


@Column({ name: 'horas_jugadas', type: 'int', default: 0 })
horasJugadas: number;


@UpdateDateColumn({ name: 'actualizado_en' })
actualizadoEn: Date;
}