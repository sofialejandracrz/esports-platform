import { Torneo } from "src/modules/torneo/entities/torneo.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario_trofeos' })
export class UsuarioTrofeo {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Usuario, (u) => u.trofeos, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@ManyToOne(() => Torneo, { nullable: true })
@JoinColumn({ name: 'torneo_id' })
torneo?: Torneo;


@Column({ name: 'tipo_trofeo' })
tipoTrofeo: string;


@CreateDateColumn({ name: 'ganado_en' })
ganadoEn: Date;
}