import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_transaccion_tipo' })
export class CatalogoTransaccionTipo {
@PrimaryGeneratedColumn('increment')
id: number;


@Column({ name: 'valor', unique: true })
valor: string; // 'saldo','creditos'


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;
}