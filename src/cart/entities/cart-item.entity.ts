import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Cart } from './cart.entity';

export class CartItem {
  @PrimaryColumn('uuid')
  cart_id: string;

  @PrimaryColumn('uuid')
  product_id: string;

  @Column('integer')
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;
}
