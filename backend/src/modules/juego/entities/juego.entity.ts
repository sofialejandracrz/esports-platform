import { CatalogoPlataforma } from "src/modules/catalogo-plataforma/entities/catalogo-plataforma.entity";
import { ModoJuego } from "src/modules/modo-juego/entities/modo-juego.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'juego' })
export class Juego {
@PrimaryGeneratedColumn('uuid')
id: string;


@Column({ name: 'nombre', unique: true })
nombre: string;


@Column({ name: 'descripcion', type: 'clob', nullable: true })
descripcion?: string;


@CreateDateColumn({ name: 'creado_en' })
creadoEn: Date;


@OneToMany(() => ModoJuego, (m) => m.juego)
modos: ModoJuego[];


@ManyToMany(() => CatalogoPlataforma)
@JoinTable({ name: 'juego_plataformas' })
plataformas: CatalogoPlataforma[];
}