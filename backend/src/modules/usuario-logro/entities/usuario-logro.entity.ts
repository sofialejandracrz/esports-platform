import { Logro } from "src/modules/logro/entities/logro.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario_logros' })
export class UsuarioLogro {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Usuario, (u) => u.logrosUsuario, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@ManyToOne(() => Logro)
@JoinColumn({ name: 'logro_id' })
logro: Logro;


@CreateDateColumn({ name: 'fecha' })
fecha: Date;
}