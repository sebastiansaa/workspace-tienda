export class DeleteAddressCommand {
    constructor(
        public readonly userId: string,
        public readonly addressId: string,
    ) { }
}

export default DeleteAddressCommand;
