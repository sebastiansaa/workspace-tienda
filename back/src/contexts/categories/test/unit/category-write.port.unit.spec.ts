import { CreateCategoryUseCase } from '../../app/usecases/create-category.usecase';
import { UpdateCategoryUseCase } from '../../app/usecases/update-category.usecase';
import { DeleteCategoryUseCase } from '../../app/usecases/delete-category.usecase';
import { CategoryEntity } from '../../domain/entity/category.entity';
import { CategoryNotFoundError, DuplicateCategoryError } from '../../domain/errors/category.errors';

describe('ICategoryWriteRepository (unit) - port contract', () => {
    const makeEntity = (): CategoryEntity =>
        CategoryEntity.create({ title: 'Tit', slug: `slug-${Date.now()}`, image: 'http://example.com/img.jpg', description: 'd', active: true, sortOrder: 1 });

    it('CreateCategoryUseCase delegates to writeRepo.save and passes domain entity', async () => {
        const readRepo = { findBySlug: jest.fn().mockResolvedValue(null) } as any;
        const writeRepo = { save: jest.fn().mockResolvedValue({ id: 11 }) } as any;
        const uc = new CreateCategoryUseCase(readRepo, writeRepo);
        const res = await uc.execute({ title: 'Xxx', slug: 'uxx', image: 'http://example.com/img.jpg', description: '', active: true, sortOrder: 0 } as any);
        expect(readRepo.findBySlug).toHaveBeenCalledWith('uxx');
        expect(writeRepo.save).toHaveBeenCalledTimes(1);
        expect(res.id).toBe(11);
    });

    it('UpdateCategoryUseCase throws when not found', async () => {
        const readRepo = { findById: jest.fn().mockResolvedValue(null), findBySlug: jest.fn() } as any;
        const writeRepo = { save: jest.fn() } as any;
        const uc = new UpdateCategoryUseCase(readRepo, writeRepo);
        await expect(uc.execute({ id: 999, title: '', slug: '', image: '', description: '', active: true, sortOrder: 0 } as any)).rejects.toBeInstanceOf(CategoryNotFoundError);
    });

    it('UpdateCategoryUseCase throws on duplicate slug when changing slug', async () => {
        const existing = makeEntity();
        const readRepo = { findById: jest.fn().mockResolvedValue(existing), findBySlug: jest.fn().mockResolvedValue(existing) } as any;
        const writeRepo = { save: jest.fn() } as any;
        const uc = new UpdateCategoryUseCase(readRepo, writeRepo);
        await expect(uc.execute({ id: existing.id!, title: '', slug: 'other', image: '', description: '', active: true, sortOrder: 0 } as any)).rejects.toBeInstanceOf(DuplicateCategoryError);
    });

    it('DeleteCategoryUseCase calls writeRepo.delete when exists', async () => {
        const entity = makeEntity();
        const readRepo = { findById: jest.fn().mockResolvedValue(entity) } as any;
        const writeRepo = { delete: jest.fn().mockResolvedValue(undefined) } as any;
        const uc = new DeleteCategoryUseCase(readRepo, writeRepo);
        await uc.execute(1);
        expect(writeRepo.delete).toHaveBeenCalledWith(1);
    });
});
