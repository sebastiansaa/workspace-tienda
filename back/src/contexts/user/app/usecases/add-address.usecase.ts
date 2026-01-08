import { AddAddressCommand } from "../commands/add-address.command";
import { IUserWriteRepository } from "../ports/user-write.repository";
import { IUserReadRepository } from "../ports/user-read.repository";
import { AddressEntity } from "../../domain/entity/address.entity";
import { UserNotFoundError } from "../../domain/errors/user.errors";

export class AddAddressUseCase {
    constructor(
        private readonly readRepo: IUserReadRepository,
        private readonly writeRepo: IUserWriteRepository
    ) { }

    async execute(command: AddAddressCommand): Promise<AddressEntity> {
        const user = await this.readRepo.findByIdWithAddresses(command.userId);
        if (!user) throw new UserNotFoundError();

        const address = user.addAddress({
            street: command.street,
            city: command.city,
            country: command.country,
            zipCode: command.zipCode
        });

        return this.writeRepo.addAddress(user.id, address);
    }
}
