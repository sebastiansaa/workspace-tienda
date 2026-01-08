import { UpdateUserProfileDto, AddressDto, UserResponseDto, AddressResponseDto } from '../dtos';
import UpdateUserProfileCommand from '../../app/commands/update-user-profile.command';
import AddAddressCommand from '../../app/commands/add-address.command';
import UpdateAddressCommand from '../../app/commands/update-address.command';
import DeleteAddressCommand from '../../app/commands/delete-address.command';
import ChangeUserStatusCommand from '../../app/commands/change-user-status.command';
import GetUserProfileQuery from '../../app/queries/get-user-profile.query';
import ListUsersQuery from '../../app/queries/list-users.query';
import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';
import { UserStatus } from '../../domain/v-o/user-status.vo';

export class UserApiMapper {
    static toGetProfileQuery(userId: string): GetUserProfileQuery {
        return new GetUserProfileQuery(userId);
    }

    static toListUsersQuery(): ListUsersQuery {
        return new ListUsersQuery();
    }

    static toUpdateProfileCommand(userId: string, dto: UpdateUserProfileDto): UpdateUserProfileCommand {
        return new UpdateUserProfileCommand(userId, dto.name, dto.phone, dto.preferences);
    }

    static toAddAddressCommand(userId: string, dto: AddressDto): AddAddressCommand {
        return new AddAddressCommand(userId, dto.street, dto.city, dto.country, dto.zipCode);
    }

    static toUpdateAddressCommand(userId: string, addressId: string, dto: Partial<AddressDto>): UpdateAddressCommand {
        return new UpdateAddressCommand(userId, addressId, dto.street, dto.city, dto.country, dto.zipCode);
    }

    static toDeleteAddressCommand(userId: string, addressId: string): DeleteAddressCommand {
        return new DeleteAddressCommand(userId, addressId);
    }

    static toChangeStatusCommand(userId: string, status: UserStatus): ChangeUserStatusCommand {
        return new ChangeUserStatusCommand(userId, status);
    }

    static toUserResponse(user: UserEntity): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            status: user.status,
            preferences: user.preferences,
            addresses: user.addresses.map(this.toAddressResponse),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }

    static toUserResponseList(users: UserEntity[]): UserResponseDto[] {
        return users.map((u) => this.toUserResponse(u));
    }

    static toAddressResponse(address: AddressEntity): AddressResponseDto {
        return {
            id: address.id,
            street: address.street,
            city: address.city,
            country: address.country,
            zipCode: address.zipCode,
            createdAt: address.createdAt.toISOString(),
            updatedAt: address.updatedAt.toISOString(),
        };
    }
}

export default UserApiMapper;
