import { adminApi } from "../api/adminApi";
import { mapAdminUser } from "./mappers";
import type { AdminUserDTO, AdminListQuery, ChangeUserStatusDto } from "../interfaces";
import { requireAdmin } from "../helpers/permissions";

export const getAdminUsers = async (query?: AdminListQuery) => {
    requireAdmin();
    const response = await adminApi.getUsers(query);
    return response.data.map(mapAdminUser);
};

export const getAdminUserById = async (id: string) => {
    requireAdmin();
    const response = await adminApi.getUserById(id);
    return mapAdminUser(response.data as AdminUserDTO);
};

export const changeAdminUserStatus = async (id: string, body: ChangeUserStatusDto) => {
    requireAdmin();
    const response = await adminApi.changeUserStatus(id, body);
    return mapAdminUser(response.data as AdminUserDTO);
};
