import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'membresia_tipo' })
export class MembresiaTipo {
@PrimaryGeneratedColumn('uuid')
id: string;


@Column({ name: 'nombre' })
nombre: string;


@Column({ name: 'precio', type: 'numeric', precision: 12, scale: 2 })
precio: string;


@Column({ name: 'duracion_dias', type: 'int' })
duracionDias: number;


@Column({ name: 'beneficios', type: 'clob', nullable: true })
beneficios?: string;
}