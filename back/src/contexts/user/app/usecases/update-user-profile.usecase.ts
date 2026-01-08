import { UpdateUserProfileCommand } from "../commands/update-user-profile.command";
import { IUserWriteRepository } from "../ports/user-write.repository";
import { IUserReadRepository } from "../ports/user-read.repository";
import { UserEntity } from "../../domain/entity/user.entity";
import { UserNotFoundError } from "../../domain/errors/user.errors";

export class UpdateUserProfileUseCase {
    constructor(
        private readonly readRepo: IUserReadRepository,
        private readonly writeRepo: IUserWriteRepository
    ) { }

    async execute(command: UpdateUserProfileCommand): Promise<UserEntity> {
        const user = await this.readRepo.findById(command.userId);
        if (!user) throw new UserNotFoundError();

        user.updateProfile({
            name: command.name,
            phone: command.phone,
            preferences: command.preferences
        });

        return this.writeRepo.save(user);
    }
}
