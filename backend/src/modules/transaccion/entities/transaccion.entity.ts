import { CatalogoOrigenTransaccion } from "src/modules/catalogo-origen-transaccion/entities/catalogo-origen-transaccion.entity";
import { CatalogoTransaccionTipo } from "src/modules/catalogo-transaccion-tipo/entities/catalogo-transaccion-tipo.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'transaccion' })
export class Transaccion {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => Usuario, (u) => u.transacciones, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;


@ManyToOne(() => CatalogoTransaccionTipo, { nullable: false })
@JoinColumn({ name: 'tipo_id' })
tipo: CatalogoTransaccionTipo;


@Column({ name: 'monto', type: 'numeric', precision: 12, scale: 2 })
monto: string;


@Column({ name: 'descripcion', nullable: true })
descripcion?: string;


@ManyToOne(() => CatalogoOrigenTransaccion, { nullable: false })
@JoinColumn({ name: 'origen_id' })
origen: CatalogoOrigenTransaccion;


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;
}