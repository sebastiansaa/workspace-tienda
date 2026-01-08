import { SaveProductUsecase } from 'src/contexts/products/app/usecases/save-product.usecase';
import { SaveProductCommand } from 'src/contexts/products/app/commands/save-product.command';
import { ProductEntity } from 'src/contexts/products/domain/entity/product.entity';

describe('SaveProductUsecase - unit', () => {
    it('crea nuevo producto y valida categoría', async () => {
        const read = { findById: jest.fn() } as any;
        const write = { save: jest.fn().mockImplementation((x) => x) } as any;
        const policy = { ensureCategoryExists: jest.fn().mockResolvedValue(true) } as any;

        const uc = new SaveProductUsecase(read, write, policy);

        const cmd = new SaveProductCommand({ title: 'X', slug: 'x', price: 1, images: ['https://example.com/1.jpg'], categoryId: 1 });
        const res = await uc.execute(cmd);

        expect(policy.ensureCategoryExists).toHaveBeenCalledWith(1);
        expect(write.save).toHaveBeenCalled();
    });

    it('lanza si faltan campos requeridos', async () => {
        const uc = new SaveProductUsecase({} as any, {} as any, { ensureCategoryExists: jest.fn() } as any);
        const cmd = new SaveProductCommand({ slug: 'x' } as any);
        await expect(uc.execute(cmd)).rejects.toThrow();
    });
});
