export class AddAddressCommand {
    constructor(
        public readonly userId: string,
        public readonly street: string,
        public readonly city: string,
        public readonly country: string,
        public readonly zipCode: string,
    ) { }
}

export default AddAddressCommand;
