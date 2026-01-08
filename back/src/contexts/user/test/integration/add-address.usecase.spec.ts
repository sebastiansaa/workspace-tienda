import { AddAddressUseCase } from 'src/contexts/user/app/usecases/add-address.usecase';
import { AddAddressCommand } from 'src/contexts/user/app/commands/add-address.command';
import { UserEntity } from 'src/contexts/user/domain/entity/user.entity';
import { AddressEntity } from 'src/contexts/user/domain/entity/address.entity';
import { UserNotFoundError } from 'src/contexts/user/domain/errors/user.errors';

describe('AddAddressUseCase Integration', () => {
    let usecase: AddAddressUseCase;
    let readRepo: { findByIdWithAddresses: jest.Mock };
    let writeRepo: { addAddress: jest.Mock };

    const buildUser = () => UserEntity.create({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test',
        status: 'ACTIVE',
        phone: null,
        preferences: null,
        addresses: [],
    });

    beforeEach(() => {
        readRepo = { findByIdWithAddresses: jest.fn() };
        writeRepo = { addAddress: jest.fn() };
        usecase = new AddAddressUseCase(readRepo as any, writeRepo as any);
    });

    it('should add address successfully', async () => {
        const mockUser = buildUser();
        readRepo.findByIdWithAddresses.mockResolvedValue(mockUser);
        writeRepo.addAddress.mockResolvedValue(AddressEntity.create({ street: 'St', city: 'Ct', country: 'Co', zipCode: '000' }));

        const command = new AddAddressCommand('user-1', 'St', 'Ct', 'Co', '000');
        const result = await usecase.execute(command);

        expect(readRepo.findByIdWithAddresses).toHaveBeenCalledWith('user-1');
        expect(writeRepo.addAddress).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it('should throw if user not found', async () => {
        readRepo.findByIdWithAddresses.mockResolvedValue(null);

        const command = new AddAddressCommand('user-1', 'S', 'C', 'C', '0');

        await expect(usecase.execute(command)).rejects.toThrow(UserNotFoundError);
    });
});
