import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_estado_amistad' })
export class CatalogoEstadoAmistad {
@PrimaryGeneratedColumn('increment')
id: number;


@Column({ name: 'valor', unique: true })
valor: string; // e.g. 'pendiente','aceptado','rechazado','bloqueado'


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;
}