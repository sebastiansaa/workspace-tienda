import { UserStatus } from '../../domain/v-o/user-status.vo';

export class ChangeUserStatusCommand {
    constructor(
        public readonly userId: string,
        public readonly status: UserStatus,
    ) { }
}

export default ChangeUserStatusCommand;
