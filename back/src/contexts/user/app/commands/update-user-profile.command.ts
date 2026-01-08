export class UpdateUserProfileCommand {
    constructor(
        public readonly userId: string,
        public readonly name?: string,
        public readonly phone?: string | null,
        public readonly preferences?: Record<string, unknown> | null,
    ) { }
}

export default UpdateUserProfileCommand;
