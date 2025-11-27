import { TiendaOrden } from "src/modules/tienda-orden/entities/tienda-orden.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    Index, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";

@Entity({ name: 'tienda_solicitud_soporte' })
export class TiendaSolicitudSoporte {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => TiendaOrden, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'orden_id' })
    orden?: TiendaOrden;

    @Index()
    @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Column({ name: 'tipo', type: 'varchar', length: 50 })
    tipo: string; // 'reclamar_nickname', 'otro'

    @Column({ name: 'nickname_solicitado', type: 'varchar', nullable: true })
    nicknameSolicitado?: string;

    @Index()
    @Column({ name: 'estado', type: 'varchar', length: 50, default: 'pendiente' })
    estado: string; // pendiente, en_revision, aprobado, rechazado

    @Column({ name: 'notas_admin', type: 'text', nullable: true })
    notasAdmin?: string;

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'actualizado_en' })
    actualizadoEn: Date;

    @Column({ name: 'resuelto_en', type: 'timestamp', nullable: true })
    resueltoEn?: Date;

    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'resuelto_por' })
    resueltoPor?: Usuario;
}
