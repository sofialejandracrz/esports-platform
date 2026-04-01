import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_origen_transaccion' })
export class CatalogoOrigenTransaccion {
@PrimaryGeneratedColumn('increment')
id: number;


@Column({ name: 'valor', unique: true })
valor: string; // 'compra','torneo','retiro','admin','tienda'


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;
}