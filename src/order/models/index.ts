import { Address, OrderStatus, Payment } from '../type';

export type Order = {
  id: string;
  user_id: string;
  cart_id: string;
  address: Address;
  items: Array<{ product_id: string; count: number }>;
  comments: string;
  delivery: Address;
  payment: Payment;
  total: number;
  status: OrderStatus;
};
