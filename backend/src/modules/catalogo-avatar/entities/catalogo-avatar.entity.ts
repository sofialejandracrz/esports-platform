import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_avatar' })
export class CatalogoAvatar {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'nombre', unique: true })
    nombre: string; // e.g. 'bottts-felix', 'bottts-aneka', etc.

    @Column({ name: 'url' })
    url: string; // https://api.dicebear.com/9.x/bottts/svg?seed=nombre

    @Column({ name: 'seed' })
    seed: string; // El seed único para generar el avatar

    @Column({ name: 'categoria', nullable: true })
    categoria?: string; // e.g. 'bottts', 'avataaars', etc.

    @Column({ name: 'disponible', type: 'number', precision: 1, default: 1 })
    disponible: number; // Si el avatar está disponible para usar

    @Column({ name: 'premium', type: 'number', precision: 1, default: 0 })
    premium: number; // Si requiere membresía premium

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;
}
