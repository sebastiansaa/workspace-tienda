import { CreateReviewUseCase } from 'src/contexts/reviews/app/usecases';
import { CreateReviewCommand } from 'src/contexts/reviews/app/commands';
import { IReviewReadRepository } from 'src/contexts/reviews/app/ports/review-read.repository';
import { IReviewWriteRepository } from 'src/contexts/reviews/app/ports/review-write.repository';
import { AuthPort, OrdersPort, ProductsPort, UserPort } from 'src/contexts/reviews/app/ports';
import ReviewEntity from 'src/contexts/reviews/domain/entity/review.entity';

describe('CreateReviewUseCase', () => {
    const userId = '8d3bcd9e-1dca-4fd4-92f2-4f8b7b9e5b55';
    const productId = 100;
    const defaultCommand = new CreateReviewCommand(userId, productId, 5, 'Excelente calidad y entrega rápida');

    let readRepo: jest.Mocked<IReviewReadRepository>;
    let writeRepo: jest.Mocked<IReviewWriteRepository>;
    let authPort: jest.Mocked<AuthPort>;
    let userPort: jest.Mocked<UserPort>;
    let productsPort: jest.Mocked<ProductsPort>;
    let ordersPort: jest.Mocked<OrdersPort>;
    let useCase: CreateReviewUseCase;

    beforeEach(() => {
        readRepo = {
            findById: jest.fn(),
            findByProduct: jest.fn(),
            findByUser: jest.fn(),
            findByUserAndProduct: jest.fn(),
            existsByUserAndProduct: jest.fn(),
        } as unknown as jest.Mocked<IReviewReadRepository>;

        writeRepo = {
            save: jest.fn(async (review) => review),
            delete: jest.fn(),
        } as jest.Mocked<IReviewWriteRepository>;

        authPort = { ensureAuthenticated: jest.fn().mockResolvedValue(undefined) } as jest.Mocked<AuthPort>;
        userPort = { ensureUserExists: jest.fn().mockResolvedValue(undefined) } as jest.Mocked<UserPort>;
        productsPort = { ensureProductExists: jest.fn().mockResolvedValue(undefined) } as jest.Mocked<ProductsPort>;
        ordersPort = { hasUserPurchasedProduct: jest.fn().mockResolvedValue(true) } as jest.Mocked<OrdersPort>;

        useCase = new CreateReviewUseCase(readRepo, writeRepo, authPort, userPort, productsPort, ordersPort);
    });

    it('crea una nueva reseña cuando el usuario no tiene una previa', async () => {
        readRepo.findByUserAndProduct.mockResolvedValue(null);

        const result = await useCase.execute(defaultCommand);

        expect(authPort.ensureAuthenticated).toHaveBeenCalledWith(userId);
        expect(userPort.ensureUserExists).toHaveBeenCalledWith(userId);
        expect(productsPort.ensureProductExists).toHaveBeenCalledWith(productId);
        expect(ordersPort.hasUserPurchasedProduct).toHaveBeenCalledWith(userId, productId);
        expect(writeRepo.save).toHaveBeenCalledTimes(1);
        expect(result.productId).toBe(productId);
        expect(result.userId).toBe(userId);
        expect(result.rating).toBe(defaultCommand.rating);
        expect(result.comment).toBe(defaultCommand.comment);
    });

    it('reemplaza la reseña existente del mismo usuario manteniendo privacidad', async () => {
        const existing = ReviewEntity.rehydrate({
            id: 'd9fe0a2f-64ff-4db2-8a4f-0f97ab74ae66',
            userId,
            productId,
            rating: 2,
            comment: 'Viejo comentario',
            createdAt: new Date('2025-01-01'),
        });
        readRepo.findByUserAndProduct.mockResolvedValue(existing);

        const command = new CreateReviewCommand(userId, productId, 4, '  <strong>Nuevo comentario</strong>  ');
        const result = await useCase.execute(command);

        expect(writeRepo.save).toHaveBeenCalledTimes(1);
        const persisted = writeRepo.save.mock.calls[0][0];
        expect(persisted.id).toBe('d9fe0a2f-64ff-4db2-8a4f-0f97ab74ae66');
        expect(persisted.rating).toBe(4);
        expect(persisted.comment).toBe('Nuevo comentario');
        expect(result.comment).toBe('Nuevo comentario');
    });
});
