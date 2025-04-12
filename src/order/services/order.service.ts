import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateOrderPayload, OrderStatus } from '../type';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getAll() {
    return await this.orderRepository.find();
  }

  async findById(orderId: string) {
    return await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });
  }

  async create(data: CreateOrderPayload, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(Order)
      : this.orderRepository;

    const order = repository.create({
      id: randomUUID(),
      user_id: data.userId,
      cart_id: data.cartId,
      payment: data.payment,
      delivery: data.address,
      items: data.items,
      comments: data.comments,
      total: data.total,
      status: OrderStatus.Open,
    });

    return await repository.save(order);
  }

  // TODO add  type
  async update(orderId: string, data: Order) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    Object.assign(order, {
      ...data,
      id: orderId,
    });

    return await this.orderRepository.save(order);
  }
}
