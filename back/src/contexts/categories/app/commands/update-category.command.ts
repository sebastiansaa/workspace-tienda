export class UpdateCategoryCommand {
    constructor(
        public readonly id: number,
        public readonly title?: string,
        public readonly slug?: string,
        public readonly image?: string,
        public readonly description?: string,
        public readonly active?: boolean,
        public readonly sortOrder?: number
    ) { }
}
