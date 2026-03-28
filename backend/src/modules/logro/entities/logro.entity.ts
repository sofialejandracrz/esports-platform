import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'logro' })
export class Logro {
@PrimaryGeneratedColumn('uuid')
id: string;


@Column({ name: 'nombre' })
nombre: string;


@Column({ name: 'descripcion', type: 'clob', nullable: true })
descripcion?: string;
}