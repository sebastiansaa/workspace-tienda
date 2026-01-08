import { GetCategoryUseCase } from '../../app/usecases/get-category.usecase';
import { ListCategoriesUseCase } from '../../app/usecases/list-categories.usecase';
import { CreateCategoryUseCase } from '../../app/usecases/create-category.usecase';
import { DuplicateCategoryError } from '../../domain/errors/category.errors';
import { CategoryEntity } from '../../domain/entity/category.entity';

describe('ICategoryReadRepository (unit) - port contract', () => {
    const makeEntity = (overrides: Partial<CategoryEntity> = {}): CategoryEntity =>
        CategoryEntity.rehydrate({
            id: 10,
            title: 'Tit',
            slug: 'slug',
            image: 'http://example.com/img.jpg',
            description: 'd',
            active: true,
            sortOrder: 1,
            deletedAt: null,
            createdAt: new Date(0),
            updatedAt: new Date(0),
            ...overrides,
        });

    it('GetCategoryUseCase returns entity when repo resolves and calls repository exactly once', async () => {
        const entity = makeEntity();
        const repo = { findById: jest.fn().mockResolvedValue(entity) } as any;
        const uc = new GetCategoryUseCase(repo);

        const res = await uc.execute(10);

        expect(repo.findById).toHaveBeenCalledTimes(1);
        expect(repo.findById).toHaveBeenCalledWith(10);
        expect(res).toBe(entity);
        expect(res.id).toBe(10);
        expect(res.title).toBe('Tit');
    });

    it('GetCategoryUseCase throws when category not found', async () => {
        const repo = { findById: jest.fn().mockResolvedValue(null) } as any;
        const uc = new GetCategoryUseCase(repo);
        await expect(uc.execute(99)).rejects.toThrow();
        expect(repo.findById).toHaveBeenCalledWith(99);
    });

    it('ListCategoriesUseCase returns full list preserving shape', async () => {
        const list = [makeEntity({ id: 1 }), makeEntity({ id: 2 })];
        const repo = { findAll: jest.fn().mockResolvedValue(list) } as any;
        const uc = new ListCategoriesUseCase(repo);
        const res = await uc.execute();
        expect(repo.findAll).toHaveBeenCalledTimes(1);
        expect(res).toEqual(list);
        expect(res[0].id).toBe(1);
    });

    it('CreateCategoryUseCase uses findBySlug to prevent duplicates', async () => {
        const existing = makeEntity({ id: 5, slug: 'dup' });
        const readRepo = { findBySlug: jest.fn().mockResolvedValue(existing) } as any;
        const writeRepo = { save: jest.fn() } as any;
        const uc = new CreateCategoryUseCase(readRepo, writeRepo);

        await expect(uc.execute({ title: 'Xxx', slug: 'dup', image: 'http://example.com/img.jpg', description: '', active: true, sortOrder: 1 })).rejects.toBeInstanceOf(DuplicateCategoryError);
        expect(readRepo.findBySlug).toHaveBeenCalledWith('dup');
        expect(writeRepo.save).not.toHaveBeenCalled();
    });

    it('CreateCategoryUseCase delegates to writeRepo.save when slug unique and passes domain entity', async () => {
        const readRepo = { findBySlug: jest.fn().mockResolvedValue(null) } as any;
        const writeRepo = { save: jest.fn().mockImplementation((c: any) => Promise.resolve({ ...c, id: 77 })) } as any;
        const uc = new CreateCategoryUseCase(readRepo, writeRepo);

        const cmd = { title: 'Xxx', slug: 'uxx', image: 'http://example.com/img.jpg', description: 'd', active: true, sortOrder: 2 } as any;
        const saved = await uc.execute(cmd);

        expect(readRepo.findBySlug).toHaveBeenCalledWith('uxx');
        expect(writeRepo.save).toHaveBeenCalledTimes(1);
        const passed = writeRepo.save.mock.calls[0][0];
        expect(passed.slug).toBe('uxx');
        expect(saved.id).toBe(77);
    });
});
