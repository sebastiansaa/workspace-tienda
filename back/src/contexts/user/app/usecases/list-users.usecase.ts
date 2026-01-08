import { IUserReadRepository } from "../ports/user-read.repository";
import { UserEntity } from "../../domain/entity/user.entity";

export class ListUsersUseCase {
    constructor(private readonly repo: IUserReadRepository) { }

    async execute(): Promise<UserEntity[]> {
        return this.repo.listAll();
    }
}
