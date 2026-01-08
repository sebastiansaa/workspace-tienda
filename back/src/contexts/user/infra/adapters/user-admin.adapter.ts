import { Injectable } from '@nestjs/common';
import { ChangeUserStatusUseCase, GetUserProfileUseCase, ListUsersUseCase } from '../../app/usecases/index';
import { UserStatus } from '../../domain/v-o/user-status.vo';
import { UserAdminPort } from '../../../shared/ports/admin/user-admin.port';
import type { UserResponseDto } from '../../api/dtos/response/user.response.dto';
import { UserApiMapper } from '../../api/mappers/user-api.mapper';

@Injectable()
export class UserAdminAdapter implements UserAdminPort {
    constructor(
        private readonly getProfileUseCase: GetUserProfileUseCase,
        private readonly listUsersUseCase: ListUsersUseCase,
        private readonly changeStatusUseCase: ChangeUserStatusUseCase,
    ) { }

    async listUsers(): Promise<UserResponseDto[]> {
        const users = await this.listUsersUseCase.execute();
        return UserApiMapper.toUserResponseList(users);
    }

    async getProfile(id: string): Promise<UserResponseDto> {
        const user = await this.getProfileUseCase.execute(id);
        return UserApiMapper.toUserResponse(user);
    }

    async changeStatus(id: string, status: string): Promise<UserResponseDto> {
        const user = await this.changeStatusUseCase.execute({ userId: id, status: status as UserStatus });
        return UserApiMapper.toUserResponse(user);
    }
}
