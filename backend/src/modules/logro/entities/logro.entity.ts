import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'logro' })
export class Logro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nombre', unique: true })
  nombre: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'puntos', type: 'int', default: 0 })
  puntos: number;

  @Column({ name: 'icono_url', nullable: true })
  iconoUrl?: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
