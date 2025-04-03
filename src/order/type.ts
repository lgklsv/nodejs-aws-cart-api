export enum OrderStatus {
  Open = 'OPEN',
  Approved = 'APPROVED',
  Confirmed = 'CONFIRMED',
  Sent = 'SENT',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
}

type StatusHistory = Array<{
  status: OrderStatus;
  timestamp: number;
  comment: string;
}>;

export type Payment = {
  type: string;
  amount: number;
  currency: string;
  details?: Record<string, any>;
};

export type Address = {
  address: string;
  firstName: string;
  lastName: string;
  comment: string;
};
export type CreateOrderDto = {
  items: Array<{ productId: string; count: 1 }>;
  address: Address;
  payment: Payment;
  comments: string | null;
  status: string;
  total: number;
};

export type PutCartPayload = {
  product: { description: string; id: string; title: string; price: number };
  count: number;
};
export type CreateOrderPayload = {
  userId: string;
  cartId: string;
  items: Array<{ product_id: string; count: number }>;
  address: Address;
  status: OrderStatus;
  payment: Payment;
  comments: string;
  total: number;
};
