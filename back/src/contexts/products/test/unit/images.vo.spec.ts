import ImagesVO from 'src/contexts/products/domain/v-o/images.vo';
import { ImagesArrayEmptyError, ImagesArrayNullError, ImageNotFoundError } from 'src/contexts/products/domain/errors/product.errors';

describe('ImagesVO', () => {
    const validUrl = 'https://example.com/img.jpg';

    it('acepta array de URLs válidas', () => {
        const imgs = new ImagesVO([validUrl]);
        expect(imgs.values).toEqual([validUrl]);
    });

    it('lanza si el valor no es array o está vacío', () => {

        expect(() => new ImagesVO(null)).toThrow(ImagesArrayNullError);
        expect(() => new ImagesVO([])).toThrow(ImagesArrayEmptyError);
    });

    it('add/remove/replace funcionan y remove lanza si no existe', () => {
        const imgs = new ImagesVO([validUrl]);
        const added = imgs.add('https://example.com/2.jpg');
        expect(added.values.length).toBe(2);
        const removed = added.remove(validUrl);
        expect(removed.values).not.toContain(validUrl);
        expect(() => removed.remove('https://x')).toThrow(ImageNotFoundError);
        const replaced = removed.replace(['https://a.com/1.jpg']);
        expect(replaced.values).toEqual(['https://a.com/1.jpg']);
    });
});
