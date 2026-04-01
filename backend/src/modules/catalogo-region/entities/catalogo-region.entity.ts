import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_region' })
export class CatalogoRegion {
@PrimaryGeneratedColumn('increment')
id: number;


@Column({ name: 'valor', unique: true })
valor: string; // e.g. 'global','NA','EU','LATAM','ASIA','AFRICA'


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;
}