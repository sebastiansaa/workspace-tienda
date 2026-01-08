export class MarkOrderAsPaidCommand {
    constructor(public readonly orderId: string, public readonly userId: string) { }
}

export default MarkOrderAsPaidCommand;
