import { adminApi } from "../api/adminApi";
import type { AdminListQuery, AdminPaymentDTO } from "../interfaces";
import { requireAdmin } from "../helpers/permissions";

export const getAdminPayments = async (query?: AdminListQuery) => {
    requireAdmin();
    const response = await adminApi.getPayments(query);
    return response.data as AdminPaymentDTO[];
};

export const getAdminPaymentById = async (id: string) => {
    requireAdmin();
    const response = await adminApi.getPaymentById(id);
    return response.data as AdminPaymentDTO;
};
