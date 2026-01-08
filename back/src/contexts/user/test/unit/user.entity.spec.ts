import { UserEntity } from 'src/contexts/user/domain/entity/user.entity';
import { AddressEntity } from 'src/contexts/user/domain/entity/address.entity';

describe('UserEntity', () => {
    const validProps = {
        id: '123',
        email: 'test@example.com',
        name: 'John Doe',
        phone: '1234567890',
        status: 'ACTIVE' as const,
        preferences: {},
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    it('should create a valid user', () => {
        const user = UserEntity.rehydrate(validProps);
        expect(user).toBeDefined();
        expect(user.id).toBe(validProps.id);
        expect(user.email).toBe(validProps.email);
    });

    it('should update profile', () => {
        const user = UserEntity.rehydrate(validProps);
        user.updateProfile({ name: 'Jane Doe', phone: '0987654321' });
        expect(user.name).toBe('Jane Doe');
        expect(user.phone).toBe('0987654321');
    });

    it('should add address', () => {
        const user = UserEntity.rehydrate(validProps);
        const address = user.addAddress({
            street: 'Main St',
            city: 'City',
            country: 'Country',
            zipCode: '12345',
        });
        expect(user.addresses.length).toBe(1);
        expect(address).toBeInstanceOf(AddressEntity);
    });

    it('should delete address', () => {
        const user = UserEntity.rehydrate(validProps);
        const address = user.addAddress({
            street: 'Main St',
            city: 'City',
            country: 'Country',
            zipCode: '12345',
        });
        user.deleteAddress(address.id);
        expect(user.addresses.length).toBe(0);
    });

    it('should change status', () => {
        const user = UserEntity.rehydrate(validProps);
        user.changeStatus('SUSPENDED');
        expect(user.status).toBe('SUSPENDED');
    });
});
