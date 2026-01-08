import { UpdateAddressCommand } from "../commands/update-address.command";
import { IUserWriteRepository } from "../ports/user-write.repository";
import { IUserReadRepository } from "../ports/user-read.repository";
import { AddressEntity } from "../../domain/entity/address.entity";
import { UserNotFoundError } from "../../domain/errors/user.errors";

export class UpdateAddressUseCase {
    constructor(
        private readonly readRepo: IUserReadRepository,
        private readonly writeRepo: IUserWriteRepository
    ) { }

    async execute(command: UpdateAddressCommand): Promise<AddressEntity> {
        const user = await this.readRepo.findByIdWithAddresses(command.userId);
        if (!user) throw new UserNotFoundError();

        const updatedAddress = user.updateAddress(command.addressId, {
            street: command.street,
            city: command.city,
            country: command.country,
            zipCode: command.zipCode
        });

        return this.writeRepo.updateAddress(user.id, updatedAddress);
    }
}
