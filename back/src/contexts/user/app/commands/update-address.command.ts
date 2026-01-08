export class UpdateAddressCommand {
    constructor(
        public readonly userId: string,
        public readonly addressId: string,
        public readonly street?: string,
        public readonly city?: string,
        public readonly country?: string,
        public readonly zipCode?: string,
    ) { }
}

export default UpdateAddressCommand;
