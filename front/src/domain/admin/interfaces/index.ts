export * from './AdminUser';
export * from './AdminProduct';
export * from './AdminOrder';
export * from './AdminInventory';
export * from './AdminPayment';
export * from './AdminCategory';
export interface UploadImageResponse {
  productId: number;
  filename: string;
  path: string;
}

export interface DashboardStatsResponse {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  pendingOrdersCount: number;
  lowStockProductsCount: number;
}
