const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const HTML_TAG_REGEX = /<[^>]+>/g;

export class ReviewCommentVO {
    private readonly valueInternal: string;

    constructor(value: string) {
        if (typeof value !== 'string') throw new Error('Comment must be a string');
        const trimmed = value.trim();
        if (trimmed.length === 0) throw new Error('Comment cannot be empty');
        if (trimmed.length > 1024) throw new Error('Comment is too long');
        const withoutScripts = trimmed.replace(SCRIPT_REGEX, '');
        const sanitized = withoutScripts.replace(HTML_TAG_REGEX, '').trim();
        this.valueInternal = sanitized;
    }

    get value(): string {
        return this.valueInternal;
    }
}

export default ReviewCommentVO;
