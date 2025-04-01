import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { CreateOrderDto, PutCartPayload } from 'src/order/type';
import { DataSource, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body: PutCartPayload) {
    // TODO: validate body payload...
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  clearUserCart(@Req() req: AppRequest) {
    this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put('order')
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const userId = getUserIdFromRequest(req);
      const cart = await this.cartService.findByUserId(userId, manager);

      if (!(cart && cart.items.length)) {
        throw new BadRequestException('Cart is empty');
      }

      const { id: cartId, items } = cart;
      const total = calculateCartTotal(items);
      const order = this.orderService.create(
        {
          userId,
          cartId,
          items: items.map(({ product_id, count }) => ({
            product_id: product_id,
            count,
          })),
          comments: '',
          payment: {
            type: 'test',
            amount: 0,
            currency: 'USD',
          },
          address: body.address,
          total,
        },
        manager,
      );
      this.cartService.removeByUserId(userId, manager);

      return {
        order,
      };
    });
  }

  @UseGuards(BasicAuthGuard)
  @Get('order')
  async getOrder() {
    return await this.orderService.getAll();
  }
}
