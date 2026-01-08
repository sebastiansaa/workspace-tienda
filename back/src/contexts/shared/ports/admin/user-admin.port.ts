import type { UserResponseDto } from '../../../user/api/dtos/response/user.response.dto';

export interface UserAdminPort {
    getProfile(id: string): Promise<UserResponseDto>;
    listUsers(): Promise<UserResponseDto[]>;
    changeStatus(id: string, status: string): Promise<UserResponseDto>;
}
