import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CartStatuses } from '../models';
import { PutCartPayload } from 'src/order/type';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { EntityManager, Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(Cart)
      : this.cartRepository;

    return await repository.findOne({
      where: { user_id: userId, status: CartStatuses.OPEN },
      relations: ['items'],
    });
  }

  createByUserId(user_id: string) {
    const userCart = this.cartRepository.create({
      id: randomUUID(),
      user_id,
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

    return await this.cartRepository.save(userCart);
  }

  async closeCart(cartId: string, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(Cart)
      : this.cartRepository;

    await repository.update({ id: cartId }, { status: CartStatuses.ORDERED });
  }

  async removeByUserId(userId: string, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(Cart)
      : this.cartRepository;

    await repository.delete({ user_id: userId });
  }
}
