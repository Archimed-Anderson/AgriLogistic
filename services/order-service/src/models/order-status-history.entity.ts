// Order Status History Entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

export enum OrderEventType {
  STATUS_CHANGED = 'status_changed',
  PAYMENT_PROCESSED = 'payment_processed',
  ITEM_ADDED = 'item_added',
  ITEM_REMOVED = 'item_removed',
  SHIPPING_UPDATED = 'shipping_updated',
  NOTE_ADDED = 'note_added',
  CANCELLED = 'cancelled'
}

@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'enum', enum: OrderEventType })
  eventType: OrderEventType;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fromStatus: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  toStatus: string | null;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Order, order => order.statusHistory)
  order: Order;
}
