import { DeleteAddressCommand } from "../commands/delete-address.command";
import { IUserWriteRepository } from "../ports/user-write.repository";
import { IUserReadRepository } from "../ports/user-read.repository";
import { UserNotFoundError } from "../../domain/errors/user.errors";

export class DeleteAddressUseCase {
    constructor(
        private readonly readRepo: IUserReadRepository,
        private readonly writeRepo: IUserWriteRepository
    ) { }

    async execute(command: DeleteAddressCommand): Promise<void> {
        const user = await this.readRepo.findByIdWithAddresses(command.userId);
        if (!user) throw new UserNotFoundError();

        user.deleteAddress(command.addressId);

        await this.writeRepo.deleteAddress(user.id, command.addressId);
    }
}
