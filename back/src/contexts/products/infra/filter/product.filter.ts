import { normalizePagination } from '../../../shared/helpers/filter-utils';
import { sanitizeSort } from '../../../shared/validators/field-validation';
import { ALLOWED_SORT_FIELDS } from './sort-fields';

export interface ListParams {
    readonly page?: number;
    readonly limit?: number;
    readonly search?: string;
    readonly categoryId?: number;
    readonly active?: boolean;
    readonly inStock?: boolean;
    readonly priceMin?: number;
    readonly priceMax?: number;
    readonly sort?: string;
}

interface StringSearchFilter {
    contains: string;
    mode: 'insensitive';
}

interface NumericRangeFilter {
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
    equals?: number;
}

interface ProductWhere {
    OR?: Array<{
        title?: StringSearchFilter;
        description?: StringSearchFilter;
        slug?: StringSearchFilter;
    }>;
    categoryId?: number;
    active?: boolean;
    stock?: Pick<NumericRangeFilter, 'gt' | 'equals'>;
    price?: Pick<NumericRangeFilter, 'gte' | 'lte'>;
}

// Tipo local devuelto por el filter — no exponemos tipos de Prisma fuera de infra
export interface FindManyArgs {
    where: ProductWhere;
    skip: number;
    take: number;
    orderBy: Record<string, 'asc' | 'desc'>;
}

const LOCAL_ALLOWED_SORT = ALLOWED_SORT_FIELDS;

/**
 * Devuelve un objeto compatible con la API de Prisma `findMany`.
 * Mantiene tipos locales y evita fugas de Prisma fuera de infra.
 */
export function buildFindManyArgs(params?: ListParams): FindManyArgs {
    const { skip, take } = normalizePagination(params?.page, params?.limit);
    const orderBy = sanitizeSort(params?.sort, LOCAL_ALLOWED_SORT);

    const where: ProductWhere = {};

    if (params?.search) {
        where.OR = [
            { title: { contains: params.search, mode: 'insensitive' } },
            { description: { contains: params.search, mode: 'insensitive' } },
            { slug: { contains: params.search, mode: 'insensitive' } },
        ];
    }

    if (typeof params?.categoryId === 'number') where.categoryId = params.categoryId;
    if (typeof params?.active === 'boolean') where.active = params.active;
    if (typeof params?.inStock === 'boolean') {
        where.stock = params.inStock ? { gt: 0 } : { equals: 0 };
    }

    if (typeof params?.priceMin === 'number' || typeof params?.priceMax === 'number') {
        const priceFilter: NonNullable<ProductWhere['price']> = {};
        if (params.priceMin !== undefined) priceFilter.gte = params.priceMin;
        if (params.priceMax !== undefined) priceFilter.lte = params.priceMax;
        where.price = priceFilter;
    }

    return {
        where,
        skip,
        take,
        orderBy,
    };
}

export default { buildFindManyArgs };
