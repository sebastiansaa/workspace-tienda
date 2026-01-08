export function isAllowedField(field: string, allowed: string[]): boolean {
    return allowed.includes(field);
}

export type OrderDirection = 'asc' | 'desc';

export function parseSort(sort: string | undefined, allowedFields: string[], defaultOrder: Record<string, OrderDirection> = { updatedAt: 'desc' }) {
    if (!sort) return defaultOrder;
    const [fieldRaw, dirRaw] = sort.split(':');
    const field = fieldRaw?.trim();
    const dir = (dirRaw || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
    if (!field || !allowedFields.includes(field)) return defaultOrder;
    return { [field]: dir } as Record<string, OrderDirection>;
}

export function sanitizeSort(sort: string | undefined, allowedFields: string[], defaultOrder: Record<string, OrderDirection> = { updatedAt: 'desc' }) {
    if (!sort) return defaultOrder;
    const parsed = parseSort(sort, allowedFields, defaultOrder);
    return parsed as Record<string, OrderDirection>;
}

export default { isAllowedField, sanitizeSort, parseSort };
