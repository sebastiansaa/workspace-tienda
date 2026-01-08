import { ChangeUserStatusCommand } from "../commands/change-user-status.command";
import { IUserWriteRepository } from "../ports/user-write.repository";
import { UserEntity } from "../../domain/entity/user.entity";

export class ChangeUserStatusUseCase {
    constructor(private readonly repo: IUserWriteRepository) { }

    async execute(command: ChangeUserStatusCommand): Promise<UserEntity> {
        return this.repo.changeStatus(command.userId, command.status);
    }
}
