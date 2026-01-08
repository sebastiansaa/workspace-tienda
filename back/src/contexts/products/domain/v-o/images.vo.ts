import { ImageUrlVO } from '../../../shared/v-o/image-url.vo';
import { ImagesArrayNullError, ImagesArrayEmptyError, ImageNotFoundError } from '../errors/product.errors';

/**Para una colección de URLs de imagen.
 * Garantiza: no nulo, no vacío y todas las URLs válidas. */
export class ImagesVO {
    private readonly _values: string[];

    constructor(values: unknown) {
        if (!Array.isArray(values)) {
            throw new ImagesArrayNullError();
        }
        if (values.length === 0) {
            throw new ImagesArrayEmptyError();
        }
        this._values = values.map((v) => new ImageUrlVO(v as string).value);
    }

    get values(): string[] {
        return this._values;
    }

    add(url: string): ImagesVO {
        return new ImagesVO([...this._values, url]);
    }

    remove(url: string): ImagesVO {
        const next = this._values.filter((v) => v !== url);
        if (next.length === this._values.length) {
            throw new ImageNotFoundError();
        }
        return new ImagesVO(next);
    }

    replace(urls: string[]): ImagesVO {
        return new ImagesVO(urls);
    }
}

export default ImagesVO;
