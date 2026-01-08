import { adminApi } from "../api/adminApi";
import { mapAdminCategory } from "./mappers";
import { requireAdmin } from "../helpers/permissions";
import type { AdminCategoryDTO, CreateCategoryDto, UpdateCategoryDto } from "../interfaces";

export const getAdminCategories = async (): Promise<AdminCategoryDTO[]> => {
    requireAdmin();
    const response = await adminApi.getCategories();
    return response.data.map(mapAdminCategory);
};

export const getAdminCategoryById = async (id: number): Promise<AdminCategoryDTO> => {
    requireAdmin();
    const response = await adminApi.getCategoryById(id);
    return mapAdminCategory(response.data);
};

export const createAdminCategory = async (body: CreateCategoryDto): Promise<AdminCategoryDTO> => {
    requireAdmin();
    const response = await adminApi.createCategory(body);
    return mapAdminCategory(response.data);
};

export const updateAdminCategory = async (id: number, body: UpdateCategoryDto): Promise<AdminCategoryDTO> => {
    requireAdmin();
    const response = await adminApi.updateCategory(id, body);
    return mapAdminCategory(response.data);
};

export const deleteAdminCategory = async (id: number): Promise<void> => {
    requireAdmin();
    await adminApi.deleteCategory(id);
};
