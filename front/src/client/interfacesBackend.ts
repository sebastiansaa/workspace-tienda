// Uso: interfaces que definen la forma de las respuestas del backend para el cliente
export interface ProductDTO {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  stock: number;
  active: boolean;
  images: string[];
  categoryId: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  deletedAt?: string | null;
}

export interface ProductListDTO {
  products: ProductDTO[];
  total: number;
}

export interface CategoryDTO {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

///////////////////////////////////////////////////

export interface CartItemDTO {
  productId: number;
  quantity: number;
  price?: number;
  lineTotal: number;
}

export interface CartDTO {
  id: string;
  userId: string;
  items: CartItemDTO[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

//////////////////////////

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED';

export interface PaymentResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  externalPaymentId?: string;
  clientSecret?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}


export interface AddressResponse {
  id: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  status: UserStatus;
  preferences?: Record<string, unknown> | null;
  addresses: AddressResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemResponse {
  productId: number;
  quantity: number;
  price: number;
  lineTotal: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED';

export interface OrderResponse {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface StockResponse {
  productId: number;
  onHand: number;
  reserved: number;
  available: number;
}

export type StockMovementType = 'INCREASE' | 'DECREASE' | 'RESERVATION' | 'RELEASE';

export interface StockMovementResponse {
  id: string;
  productId: number;
  type: StockMovementType;
  reason: string;
  quantity: number;
  onHandAfter: number;
  reservedAfter: number;
  createdAt: string;
}

// --- Admin responses ---
export interface AdminUserResponse {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AdminProductResponse {
  id: number;
  title: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AdminPaymentResponse {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: string;
  provider: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AdminOrderResponse {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AdminInventoryResponse {
  productId: number;
  onHand: number;
  reserved: number;
  available: number;
  updatedAt: string | Date;
}

// --- Shared read DTOs ---
export interface ProductReadDto {
  id: number;
  title: string;
  price: number;
  stock: number;
  image?: string;
  slug?: string;
}

export interface CategoryReadDto {
  id: number | string;
  name: string;
}

// --- Auth responses ---
export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
}

export interface AuthUserResponse {
  id: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUserResponse;
  tokens: AuthTokensResponse;
}
