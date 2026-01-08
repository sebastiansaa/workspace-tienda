import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserController } from './api/controller/user.controller';
import { USER_READ_REPOSITORY, USER_WRITE_REPOSITORY, USER_READONLY, USER_VERIFICATION_PORT } from './constants';
import { UserPrismaReadRepository } from './infra/persistence/user-prisma-read.repository';
import { UserPrismaWriteRepository } from './infra/persistence/user-prisma-write.repository';
import { UserReadOnlyAdapter } from './infra/adapters/user-readonly.adapter';
import UserVerificationService from './infra/services/user-verification.service';
import {
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    AddAddressUseCase,
    UpdateAddressUseCase,
    DeleteAddressUseCase,
    ChangeUserStatusUseCase,
    ListUsersUseCase,
} from './app/usecases';
import { IUserReadRepository } from './app/ports/user-read.repository';
import { IUserWriteRepository } from './app/ports/user-write.repository';

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [UserController],
    providers: [
        { provide: USER_WRITE_REPOSITORY, useClass: UserPrismaWriteRepository },
        { provide: USER_READ_REPOSITORY, useClass: UserPrismaReadRepository },
        { provide: USER_READONLY, useClass: UserReadOnlyAdapter },
        { provide: USER_VERIFICATION_PORT, useClass: UserVerificationService },

        {
            provide: GetUserProfileUseCase,
            useFactory: (repo: IUserReadRepository) => new GetUserProfileUseCase(repo),
            inject: [USER_READ_REPOSITORY]
        },
        {
            provide: UpdateUserProfileUseCase,
            useFactory: (read: IUserReadRepository, write: IUserWriteRepository) => new UpdateUserProfileUseCase(read, write),
            inject: [USER_READ_REPOSITORY, USER_WRITE_REPOSITORY]
        },
        {
            provide: AddAddressUseCase,
            useFactory: (read: IUserReadRepository, write: IUserWriteRepository) => new AddAddressUseCase(read, write),
            inject: [USER_READ_REPOSITORY, USER_WRITE_REPOSITORY]
        },
        {
            provide: UpdateAddressUseCase,
            useFactory: (read: IUserReadRepository, write: IUserWriteRepository) => new UpdateAddressUseCase(read, write),
            inject: [USER_READ_REPOSITORY, USER_WRITE_REPOSITORY]
        },
        {
            provide: DeleteAddressUseCase,
            useFactory: (read: IUserReadRepository, write: IUserWriteRepository) => new DeleteAddressUseCase(read, write),
            inject: [USER_READ_REPOSITORY, USER_WRITE_REPOSITORY]
        },
        {
            provide: ChangeUserStatusUseCase,
            useFactory: (repo: IUserWriteRepository) => new ChangeUserStatusUseCase(repo),
            inject: [USER_WRITE_REPOSITORY]
        },
        {
            provide: ListUsersUseCase,
            useFactory: (repo: IUserReadRepository) => new ListUsersUseCase(repo),
            inject: [USER_READ_REPOSITORY]
        },
    ],
    exports: [USER_READONLY, USER_READ_REPOSITORY, USER_WRITE_REPOSITORY, USER_VERIFICATION_PORT, GetUserProfileUseCase, ListUsersUseCase, ChangeUserStatusUseCase],
})
export class UserModule { }
