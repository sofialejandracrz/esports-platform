import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_estado_inscripcion' })
export class CatalogoEstadoInscripcion {
@PrimaryGeneratedColumn('increment')
id: number;


@Column({ name: 'valor', unique: true })
valor: string; // e.g. 'pendiente','aceptado','rechazado'


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;
}