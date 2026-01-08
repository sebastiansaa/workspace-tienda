export type AdminUserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface AdminUserDTO {
    id: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    status: AdminUserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ChangeUserStatusDto {
    status: AdminUserStatus;
}

