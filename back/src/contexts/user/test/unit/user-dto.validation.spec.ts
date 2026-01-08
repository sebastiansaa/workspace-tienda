import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AddressDto, ChangeStatusDto, UpdateUserProfileDto } from 'src/contexts/user/api/dtos';

describe('AddressDto validation', () => {
    it('accepts valid payload', async () => {
        const dto = plainToInstance(AddressDto, { street: 'Calle 1', city: 'Madrid', country: 'ES', zipCode: '28001' });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
    });

    it('rejects non-string fields', async () => {
        const dto = plainToInstance(AddressDto, { street: 1, city: 'Madrid', country: 'ES', zipCode: '28001' } as any);
        const errors = await validate(dto);
        const streetError = errors.find((e) => e.property === 'street');
        expect(streetError?.constraints).toBeDefined();
    });
});

describe('UpdateUserProfileDto validation', () => {
    it('rejects invalid phone', async () => {
        const dto = plainToInstance(UpdateUserProfileDto, { phone: '123' });
        const errors = await validate(dto);
        const phoneError = errors.find((e) => e.property === 'phone');
        expect(phoneError?.constraints).toBeDefined();
    });
});

describe('ChangeStatusDto validation', () => {
    it('accepts allowed status', async () => {
        const dto = plainToInstance(ChangeStatusDto, { status: 'ACTIVE' });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
    });

    it('rejects unexpected status', async () => {
        const dto = plainToInstance(ChangeStatusDto, { status: 'BANNED' });
        const errors = await validate(dto);
        const statusError = errors.find((e) => e.property === 'status');
        expect(statusError?.constraints).toBeDefined();
    });

    it('forbids extra properties via ValidationPipe', async () => {
        const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });
        const payload = { status: 'ACTIVE', extra: 'field' };
        const transformCall = pipe.transform(payload, { type: 'body', metatype: ChangeStatusDto } as any);
        await expect(transformCall).rejects.toBeInstanceOf(BadRequestException);
    });
});