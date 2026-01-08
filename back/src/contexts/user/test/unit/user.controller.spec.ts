import { UserController } from 'src/contexts/user/api/controller/user.controller';
import {
    AddAddressUseCase,
    ChangeUserStatusUseCase,
    DeleteAddressUseCase,
    GetUserProfileUseCase,
    ListUsersUseCase,
    UpdateAddressUseCase,
    UpdateUserProfileUseCase,
} from 'src/contexts/user/app/usecases';
import { AddressNotFoundError, InvalidAddressError, UserNotFoundError } from 'src/contexts/user/domain/errors/user.errors';
import type { AuthUserPayload } from 'src/contexts/shared/interfaces/auth-user-payload.interface';

const user: AuthUserPayload = { sub: 'user-1', roles: ['user'] };

type UsecaseMock<TArgs extends any[] = any[], TResult = any> = { execute: jest.Mock<TResult, TArgs> };

type ControllerDeps = {
    getProfile: UsecaseMock;
    updateProfile: UsecaseMock;
    addAddress: UsecaseMock;
    updateAddress: UsecaseMock;
    deleteAddress: UsecaseMock;
    changeStatus: UsecaseMock;
    listUsers: UsecaseMock;
};

const makeDeps = (): ControllerDeps => ({
    getProfile: { execute: jest.fn() },
    updateProfile: { execute: jest.fn() },
    addAddress: { execute: jest.fn() },
    updateAddress: { execute: jest.fn() },
    deleteAddress: { execute: jest.fn() },
    changeStatus: { execute: jest.fn() },
    listUsers: { execute: jest.fn() },
});

const buildController = (deps: ControllerDeps) => new UserController(
    deps.getProfile as unknown as GetUserProfileUseCase,
    deps.updateProfile as unknown as UpdateUserProfileUseCase,
    deps.addAddress as unknown as AddAddressUseCase,
    deps.updateAddress as unknown as UpdateAddressUseCase,
    deps.deleteAddress as unknown as DeleteAddressUseCase,
    deps.listUsers as unknown as ListUsersUseCase,
    deps.changeStatus as unknown as ChangeUserStatusUseCase,
);

describe('UserController error propagation', () => {
    it('propagates UserNotFoundError from usecase', async () => {
        const deps = makeDeps();
        deps.getProfile.execute.mockRejectedValue(new UserNotFoundError());
        const controller = buildController(deps);

        await expect(controller.getById('user-123')).rejects.toBeInstanceOf(UserNotFoundError);
    });

    it('propagates AddressNotFoundError from delete address usecase', async () => {
        const deps = makeDeps();
        deps.deleteAddress.execute.mockRejectedValue(new AddressNotFoundError());
        const controller = buildController(deps);

        await expect(controller.deleteAddr(user, 'address-1')).rejects.toBeInstanceOf(AddressNotFoundError);
    });

    it('propagates InvalidAddressError from add address usecase', async () => {
        const deps = makeDeps();
        deps.addAddress.execute.mockRejectedValue(new InvalidAddressError());
        const controller = buildController(deps);

        await expect(controller.addAddr(user, { street: 's', city: 'c', country: 'co', zipCode: 'z' })).rejects.toBeInstanceOf(InvalidAddressError);
    });
});