import { CatalogoTipoItem } from "src/modules/catalogo-tipo-item/entities/catalogo-tipo-item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tienda_item' })
export class TiendaItem {
@PrimaryGeneratedColumn('increment')
id: number;


@ManyToOne(() => CatalogoTipoItem, { nullable: false })
@JoinColumn({ name: 'tipo_id' })
tipo: CatalogoTipoItem;


@Column({ name: 'nombre' })
nombre: string;


@Column({ name: 'descripcion', type: 'clob', nullable: true })
descripcion?: string;


@Column({ name: 'precio', type: 'numeric', precision: 12, scale: 2 })
precio: string;


@Column({ name: 'creditos_otorgados', type: 'int', nullable: true })
creditosOtorgados?: number;


@Column({ name: 'metadata', type: 'clob', nullable: true })
metadata?: string;
}