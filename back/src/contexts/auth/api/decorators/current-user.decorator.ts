import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): { sub: string } => {
        const request = ctx.switchToHttp().getRequest<{ user?: { sub?: string } }>();
        const user = request.user;
        if (!user || !user.sub) {
            throw new Error('User not found in request context');
        }
        return { sub: user.sub };
    },
);

export default CurrentUser;
