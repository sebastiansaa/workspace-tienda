import { axiosAdapter } from "@/shared/api/axiosAdapter";
import type { AxiosResponse } from "axios";
import type {
  DashboardStatsResponse,
  AdminListQuery,
  AdminProductDTO,
  UpdateProductDto,
  UploadImageResponse,
  AdminInventoryDTO,
  AdminInventoryMovementDTO,
  AdjustStockDto,
  AdminOrderDTO,
  AdminPaymentDTO,
  AdminUserDTO,
  ChangeUserStatusDto,
  AdminCategoryDTO,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../interfaces";

type ProductListResponse = {
  products: AdminProductDTO[];
  total: number;
};

const pickProductListParams = (query?: AdminListQuery) => {
  const params: {
    page?: number;
    limit?: number;
    categoryId?: number;
  } = {};

  if (query?.page) params.page = query.page;
  if (query?.limit) params.limit = query.limit;

  if (query?.filter !== undefined) {
    const maybeId = Number(query.filter);
    if (Number.isInteger(maybeId) && maybeId > 0) {
      params.categoryId = maybeId;
    }
  }

  return params;
};

const mapProductListResponse = (response: AxiosResponse<ProductListResponse>): AxiosResponse<AdminProductDTO[]> => ({
  ...response,
  data: response.data.products,
});

export const adminApi = {
  getDashboardStats: (): Promise<AxiosResponse<DashboardStatsResponse>> => axiosAdapter.get('/admin/dashboard'),

  async getProducts(query?: AdminListQuery): Promise<AxiosResponse<AdminProductDTO[]>> {
    if (query?.q) {
      const params: { query: string; page?: number; limit?: number } = { query: query.q };
      if (query.page) params.page = query.page;
      if (query.limit) params.limit = query.limit;
      const response = await axiosAdapter.get<ProductListResponse>('/products/search', { params });
      return mapProductListResponse(response);
    }

    const params = pickProductListParams(query);
    const response = await axiosAdapter.get<ProductListResponse>('/products', { params });
    return mapProductListResponse(response);
  },

  getProductById: (id: number): Promise<AxiosResponse<AdminProductDTO>> => axiosAdapter.get(`/products/${id}`),

  updateProduct: (id: number, body: UpdateProductDto): Promise<AxiosResponse<AdminProductDTO>> =>
    axiosAdapter.post('/products', { id, ...body }),

  uploadProductImage: (id: number, file: File): Promise<AxiosResponse<UploadImageResponse>> => {
    const form = new FormData();
    form.append('file', file);
    return axiosAdapter.post(`/products/${id}/upload-image`, form);
  },

  getInventoryByProductId: (productId: number): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.get(`/inventory/${productId}`),

  getInventoryMovements: (productId: number): Promise<AxiosResponse<AdminInventoryMovementDTO[]>> =>
    axiosAdapter.get(`/inventory/${productId}/movements`),

  increaseInventory: (productId: number, body: AdjustStockDto): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.post(`/inventory/${productId}/increase`, body),

  decreaseInventory: (productId: number, body: AdjustStockDto): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.post(`/inventory/${productId}/decrease`, body),

  reserveInventory: (productId: number, body: AdjustStockDto): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.post(`/inventory/${productId}/reserve`, body),

  releaseInventory: (productId: number, body: AdjustStockDto): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.post(`/inventory/${productId}/release`, body),

  getOrders: (): Promise<AxiosResponse<AdminOrderDTO[]>> => axiosAdapter.get('/orders/admin/list'),
  getOrderById: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.get(`/orders/admin/${id}`),
  cancelOrder: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.patch(`/orders/${id}/cancel`),
  payOrder: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.patch(`/orders/${id}/pay`),
  completeOrder: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.patch(`/orders/admin/${id}/complete`),

  getPayments: (_query?: AdminListQuery): Promise<AxiosResponse<AdminPaymentDTO[]>> => axiosAdapter.get('/payments/admin/list'),
  getPaymentById: (id: string): Promise<AxiosResponse<AdminPaymentDTO>> => axiosAdapter.get(`/payments/admin/${id}`),

  getUsers: (_query?: AdminListQuery): Promise<AxiosResponse<AdminUserDTO[]>> => axiosAdapter.get('/users/admin/list'),
  getUserById: (id: string): Promise<AxiosResponse<AdminUserDTO>> => axiosAdapter.get(`/users/admin/${id}`),
  changeUserStatus: (id: string, body: ChangeUserStatusDto): Promise<AxiosResponse<AdminUserDTO>> =>
    axiosAdapter.patch(`/users/admin/${id}/status`, body),

  getCategories: (): Promise<AxiosResponse<AdminCategoryDTO[]>> => axiosAdapter.get('/categories'),
  getCategoryById: (id: number): Promise<AxiosResponse<AdminCategoryDTO>> => axiosAdapter.get(`/categories/${id}`),
  createCategory: (body: CreateCategoryDto): Promise<AxiosResponse<AdminCategoryDTO>> => axiosAdapter.post('/categories', body),
  updateCategory: (id: number, body: UpdateCategoryDto): Promise<AxiosResponse<AdminCategoryDTO>> =>
    axiosAdapter.patch(`/categories/${id}`, body),
  deleteCategory: (id: number): Promise<AxiosResponse<void>> => axiosAdapter.delete(`/categories/${id}`),
};
