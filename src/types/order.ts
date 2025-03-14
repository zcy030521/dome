export interface Good {
  _id: string;
  text: string;
  img: string;
  price: number;
  num: number;
  cate: string;
  description: string;
}

export interface Order {
  _id: string;
  goodId: string;
  good?: Good;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  transactionHash?: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt?: string;
  deliveryTime?: string;
  pickupTime?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export type PaymentMethod = 'traditional' | 'crypto';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  success: boolean;
}

export interface OrderResponse extends ApiResponse<Order> {
  order: Order;
}

export interface OrderListResponse extends ApiResponse<Order[]> {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaymentData {
  paymentMethod: PaymentMethod;
  transactionHash?: string;
  walletAddress?: string;
}

export interface CreateOrderData {
  goodId: string;
  quantity: number;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
} 