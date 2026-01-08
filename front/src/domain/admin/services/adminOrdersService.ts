import { adminApi } from "../api/adminApi";
import { mapAdminOrder } from "./mappers";
import type { AdminListQuery, AdminOrderDTO } from "../interfaces";
import { requireAdmin } from "../helpers/permissions";

export const getAdminOrders = async (_query?: AdminListQuery) => {
    requireAdmin();
    const response = await adminApi.getOrders();
    return response.data.map(mapAdminOrder);
};

export const getAdminOrderById = async (id: string) => {
    requireAdmin();
    const response = await adminApi.getOrderById(id);
    return mapAdminOrder(response.data as AdminOrderDTO);
};

export const cancelAdminOrder = async (id: string) => {
    requireAdmin();
    const response = await adminApi.cancelOrder(id);
    return mapAdminOrder(response.data as AdminOrderDTO);
};

export const payAdminOrder = async (id: string) => {
    requireAdmin();
    const response = await adminApi.payOrder(id);
    return mapAdminOrder(response.data as AdminOrderDTO);
};

export const completeAdminOrder = async (id: string) => {
    requireAdmin();
    const response = await adminApi.completeOrder(id);
    return mapAdminOrder(response.data as AdminOrderDTO);
};
