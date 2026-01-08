export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export function normalizePagination(page?: number, limit?: number) {
    const p = page && page > 0 ? page : 1;
    const l = limit && limit > 0 ? Math.min(limit, MAX_LIMIT) : DEFAULT_LIMIT;
    const skip = (p - 1) * l;
    return { skip, take: l };
}

export type OrderDirection = 'asc' | 'desc';

export default { normalizePagination };
