import axios from 'axios';
import type { Order, OrderResponse, OrderListResponse } from '../types/order';
import { OrderStatus } from '../types/order';

const API_BASE_URL = 'http://localhost:3000';

export const orderService = {
  // 获取所有订单
  async getAllOrders(): Promise<Order[]> {
    const response = await axios.get<Order[]>(`${API_BASE_URL}/orders/all`);
    return response.data;
  },

  // 获取订单详情
  async getOrderById(orderId: string): Promise<Order> {
    const response = await axios.get<Order>(`${API_BASE_URL}/orders/${orderId}`);
    return response.data;
  },

  // 创建待支付订单
  async createOrder(goodId: string, quantity: number): Promise<Order> {
    const response = await axios.post<Order>(`${API_BASE_URL}/orders/create`, {
      goodId,
      quantity
    });
    return response.data;
  },

  // 支付订单
  async payOrder(orderId: string, paymentData: {
    paymentMethod: 'traditional' | 'crypto';
    transactionHash?: string;
    walletAddress?: string;
  }): Promise<Order> {
    const response = await axios.post<Order>(
      `${API_BASE_URL}/orders/${orderId}/pay`,
      paymentData
    );
    return response.data;
  },

  // 取消订单
  async cancelOrder(orderId: string): Promise<Order> {
    const response = await axios.post<Order>(`${API_BASE_URL}/orders/${orderId}/cancel`);
    return response.data;
  },

  // 获取订单关联的商品信息
  async getOrderWithGoodDetails(order: Order): Promise<Order> {
    try {
      const goodResponse = await axios.get(`${API_BASE_URL}/zyj_show/${order.goodId}`);
      return { ...order, good: goodResponse.data };
    } catch (error) {
      console.error(`获取商品信息失败: ${order.goodId}`, error);
      return order;
    }
  },

  // 批量获取订单的商品信息
  async getOrdersWithGoodDetails(orders: Order[]): Promise<Order[]> {
    return Promise.all(
      orders.map(order => this.getOrderWithGoodDetails(order))
    );
  },

  // 更新订单状态
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const response = await axios.post<Order>(
      `${API_BASE_URL}/orders/${orderId}/status`,
      { status }
    );
    return response.data;
  },

  // 获取订单状态历史
  async getOrderStatusHistory(orderId: string): Promise<Array<{
    status: OrderStatus;
    time: string;
  }>> {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}/history`);
    return response.data;
  },

  // 添加评价订单方法
  async evaluateOrder(orderId: string, evaluationData: {
    rating: number;
    content: string;
    images: string[];
  }): Promise<Order> {
    const response = await axios.post<Order>(
      `${API_BASE_URL}/orders/${orderId}/evaluate`,
      evaluationData
    );
    return response.data;
  },

  // 获取订单评价
  async getOrderEvaluation(orderId: string): Promise<{
    rating: number;
    content: string;
    images: string[];
    evaluateTime: string;
  }> {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}/evaluation`);
    return response.data;
  }
}; 