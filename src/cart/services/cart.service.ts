import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CartStatuses } from '../models';
import { PutCartPayload } from 'src/order/type';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string) {
    return this.cartRepository.findOne({ where: { user_id: userId } });
  }

  createByUserId(user_id: string): Cart {
    const timestamp = Date.now();

    const userCart = this.cartRepository.create({
      id: randomUUID(),
      user_id,
      created_at: timestamp,
      updated_at: timestamp,
      status: CartStatuses.OPEN,
      items: [],
    });

    this.cartRepository.save(userCart);

    return userCart;
  }

  async findOrCreateByUserId(userId: string) {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, payload: PutCartPayload) {
    const userCart = await this.findOrCreateByUserId(userId);

    const index = userCart.items.findIndex(
      ({ product_id }) => product_id === payload.product.id,
    );

    if (index === -1) {
      const cartItem = this.cartItemRepository.create({
        product_id: payload.product.id,
        count: payload.count,
        cart: userCart,
      });

      userCart.items.push(cartItem);
      await this.cartItemRepository.save(cartItem);
    } else if (payload.count === 0) {
      await this.cartItemRepository.delete({
        cart: { id: userCart.id },
        product_id: payload.product.id,
      });
      userCart.items.splice(index, 1);
    } else {
      userCart.items[index].count = payload.count;
      await this.cartItemRepository.save(userCart.items[index]);
    }

    return this.cartRepository.save(userCart);
  }

  removeByUserId(userId: string): void {
    this.cartRepository.delete({ user_id: userId });
  }
}
