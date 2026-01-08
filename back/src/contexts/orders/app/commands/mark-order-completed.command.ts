export class MarkOrderAsCompletedCommand {
    constructor(public readonly orderId: string, public readonly userId: string) { }
}

export default MarkOrderAsCompletedCommand;
