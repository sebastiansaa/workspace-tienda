import { adminApi } from "../api/adminApi";
import { mapAdminProduct } from "./mappers";
import type { AdminListQuery, AdminProductDTO, UpdateProductDto, UploadImageResponse } from "../interfaces";
import { requireAdmin } from "../helpers/permissions";

export const getAdminProducts = async (query?: AdminListQuery) => {
    requireAdmin();
    const response = await adminApi.getProducts(query);
    return response.data.map(mapAdminProduct);
};

export const getAdminProductById = async (id: number) => {
    requireAdmin();
    const response = await adminApi.getProductById(id);
    return mapAdminProduct(response.data as AdminProductDTO);
};

export const updateAdminProduct = async (id: number, body: UpdateProductDto) => {
    requireAdmin();
    const response = await adminApi.updateProduct(id, body);
    return mapAdminProduct(response.data as AdminProductDTO);
};

export const uploadAdminProductImage = async (id: number, file: File): Promise<UploadImageResponse> => {
    requireAdmin();
    const response = await adminApi.uploadProductImage(id, file);
    return response.data;
};
