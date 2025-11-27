import { TiendaItem } from "src/modules/tienda-item/entities/tienda-item.entity";
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

@Entity({ name: 'tienda_orden' })
export class TiendaOrden {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @ManyToOne(() => TiendaItem, { nullable: false })
    @JoinColumn({ name: 'item_id' })
    item: TiendaItem;

    // Información del pago PayPal
    @Index()
    @Column({ name: 'paypal_order_id', type: 'varchar', nullable: true })
    paypalOrderId?: string;

    @Column({ name: 'paypal_capture_id', type: 'varchar', nullable: true })
    paypalCaptureId?: string;

    @Column({ name: 'paypal_payer_id', type: 'varchar', nullable: true })
    paypalPayerId?: string;

    @Column({ name: 'paypal_payer_email', type: 'varchar', nullable: true })
    paypalPayerEmail?: string;

    // Monto y estado
    @Column({ name: 'monto', type: 'numeric', precision: 12, scale: 2 })
    monto: string;

    @Column({ name: 'divisa', type: 'varchar', length: 3, default: 'USD' })
    divisa: string;

    @Index()
    @Column({ name: 'estado', type: 'varchar', length: 50, default: 'pendiente' })
    estado: string; // pendiente, completado, fallido, reembolsado, cancelado

    // Metadata adicional
    @Column({ name: 'metadata', type: 'jsonb', default: '{}' })
    metadata: any;

    // Timestamps
    @Index()
    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;

    @Column({ name: 'completado_en', type: 'timestamp', nullable: true })
    completadoEn?: Date;

    @UpdateDateColumn({ name: 'actualizado_en' })
    actualizadoEn: Date;
}
