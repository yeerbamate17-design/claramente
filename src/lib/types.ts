export type ProductCategory = "individual" | "pack" | "mayorista";
export type DeliveryType = "envio" | "retiro";
export type OrderStatus =
  | "pendiente"
  | "comprobante_enviado"
  | "pagado"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: ProductCategory;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_whatsapp: string;
  delivery_type: DeliveryType;
  delivery_address: string | null;
  postal_code: string | null;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  status: OrderStatus;
  payment_proof_url: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { products: Product })[];
}

export interface DeliveryZone {
  id: string;
  postal_code: string;
  zone_name: string;
  is_enabled: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
