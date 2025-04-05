import 'reflect-metadata';
import { Cart } from 'src/cart/entities/cart.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address, OrderStatus, Payment } from '../type';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  cart_id: string;

  @Column('jsonb')
  items: Array<{ product_id: string; count: number }>;

  @Column({ type: 'jsonb' })
  payment: Payment;

  @Column({ type: 'jsonb' })
  delivery: Address;

  @Column({ type: 'varchar', length: 255 })
  comments: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Open })
  status: string;

  @Column({ type: 'integer' })
  total: number;

  @ManyToOne(() => Cart)
  cart: Cart;
}
