import type { Order } from '@/types';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface OrderRepository {
  getOrders(userId?: string): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | null>;
  createOrder(order: Order): Promise<{ success: boolean; error?: string }>;
}

interface DbOrderItemRow {
  product_id: string;
  product_title: string;
  product_category?: string;
  unit_price: number | string;
  quantity: number;
}

interface DbOrderRow {
  id: string;
  status: Order['status'];
  total_amount: number | string;
  subtotal: number | string;
  delivery_fee: number | string;
  discount: number | string;
  created_at: string;
  estimated_delivery?: string;
  delivery_address: Order['address'];
  payment_method: string;
  delivery_agent_name?: string;
  delivery_agent_phone?: string;
  order_items?: DbOrderItemRow[];
}

export class SupabaseOrderRepository implements OrderRepository {
  async getOrders(userId?: string): Promise<Order[]> {
    const supabase = getSupabaseClient();
    if (!supabase || !userId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return (data as unknown as DbOrderRow[]).map((row) => ({
        id: row.id,
        items: (row.order_items || []).map((item) => ({
          product: {
            id: item.product_id,
            title: item.product_title,
            category: item.product_category ?? 'Seeds',
            price: Number(item.unit_price),
            sellerName: 'AgriTrade Supplier',
            unit: 'unit',
            inStock: true,
            isFavorite: false,
            rating: 4.8,
            reviewCount: 10,
          },
          quantity: item.quantity,
        })),
        totalAmount: Number(row.total_amount),
        subtotal: Number(row.subtotal),
        deliveryFee: Number(row.delivery_fee),
        discount: Number(row.discount),
        status: row.status,
        createdAt: row.created_at,
        estimatedDelivery: row.estimated_delivery ?? 'Within 2 days',
        address: row.delivery_address,
        paymentMethod: row.payment_method,
        deliveryAgentName: row.delivery_agent_name,
        deliveryAgentPhone: row.delivery_agent_phone,
      }));
    } catch {
      return [];
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: (data.order_items || []).map((item: any) => ({
          product: {
            id: item.product_id,
            title: item.product_title,
            category: item.product_category ?? 'Seeds',
            price: Number(item.unit_price),
            sellerName: 'AgriTrade Supplier',
            unit: 'unit',
            inStock: true,
            isFavorite: false,
            rating: 4.8,
            reviewCount: 10,
          },
          quantity: item.quantity,
        })),
        totalAmount: Number(data.total_amount),
        subtotal: Number(data.subtotal),
        deliveryFee: Number(data.delivery_fee),
        discount: Number(data.discount),
        status: data.status,
        createdAt: data.created_at,
        estimatedDelivery: data.estimated_delivery ?? 'Within 2 days',
        address: data.delivery_address,
        paymentMethod: data.payment_method,
        deliveryAgentName: data.delivery_agent_name,
        deliveryAgentPhone: data.delivery_agent_phone,
      };
    } catch {
      return null;
    }
  }

  async createOrder(order: Order): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // Running in mock mode
      return { success: true };
    }

    try {
      const { error: orderError } = await supabase.from('orders').insert({
        id: order.id,
        status: order.status,
        total_amount: order.totalAmount,
        subtotal: order.subtotal,
        delivery_fee: order.deliveryFee,
        discount: order.discount,
        payment_method: order.paymentMethod,
        delivery_address: order.address,
        estimated_delivery: order.estimatedDelivery,
        created_at: order.createdAt,
      });

      if (orderError) {
        return { success: false, error: orderError.message };
      }

      // Insert order items
      const itemsPayload = order.items.map((it) => ({
        order_id: order.id,
        product_id: it.product.id,
        product_title: it.product.title,
        product_category: it.product.category,
        quantity: it.quantity,
        unit_price: it.product.price,
        total_price: it.product.price * it.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload);
      if (itemsError) {
        return { success: false, error: itemsError.message };
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create order' };
    }
  }
}

export const orderRepository: OrderRepository = new SupabaseOrderRepository();
