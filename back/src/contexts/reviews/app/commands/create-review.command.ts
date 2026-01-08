export class CreateReviewCommand {
    constructor(
        public readonly userId: string,
        public readonly productId: number,
        public readonly rating: number,
        public readonly comment: string,
    ) { }
}

export default CreateReviewCommand;
