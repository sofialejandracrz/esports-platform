import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'catalogo_tipo_entrada' })
export class CatalogoTipoEntrada {
    @PrimaryGeneratedColumn('increment')
    id: number;


    @Column({ name: 'valor', unique: true })
    valor: string; // e.g. 'mando','teclado','todos'


    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;
}