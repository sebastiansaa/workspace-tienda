import { IUserReadRepository } from "../ports/user-read.repository";
import { UserEntity } from "../../domain/entity/user.entity";
import { UserNotFoundError } from "../../domain/errors/user.errors";

export class GetUserProfileUseCase {
    constructor(private readonly repo: IUserReadRepository) { }

    async execute(userId: string): Promise<UserEntity> {
        const user = await this.repo.findById(userId);
        if (!user) throw new UserNotFoundError();
        return user;
    }
}
