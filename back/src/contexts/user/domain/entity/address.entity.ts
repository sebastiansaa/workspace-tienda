import { randomUUID } from 'crypto';
import { NameVO, DateVO, Slug } from '../../../shared/v-o';

export interface AddressProps {
    id?: string;
    street: string;
    city: string;
    country: string;
    zipCode: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class AddressEntity {
    private readonly idVO: Slug;
    private streetVO: NameVO;
    private cityVO: NameVO;
    private countryVO: NameVO;
    private zipVO: NameVO;
    private createdAtVO: DateVO;
    private updatedAtVO: DateVO;

    private constructor(props: AddressProps) {
        this.idVO = new Slug(props.id);
        this.streetVO = new NameVO(props.street);
        this.cityVO = new NameVO(props.city);
        this.countryVO = new NameVO(props.country);
        this.zipVO = new NameVO(props.zipCode);
        this.createdAtVO = new DateVO(props.createdAt);
        this.updatedAtVO = DateVO.from(props.updatedAt);
    }

    static create(props: Omit<AddressProps, 'createdAt' | 'updatedAt'> & { id?: string }): AddressEntity {
        const now = new Date();
        return new AddressEntity({ ...props, id: props.id ?? randomUUID(), createdAt: now, updatedAt: now });
    }

    static rehydrate(props: AddressProps): AddressEntity {
        return new AddressEntity(props);
    }

    get id(): string { return this.idVO.value; }
    get street(): string { return this.streetVO.value; }
    get city(): string { return this.cityVO.value; }
    get country(): string { return this.countryVO.value; }
    get zipCode(): string { return this.zipVO.value; }
    get createdAt(): Date { return this.createdAtVO.value; }
    get updatedAt(): Date { return this.updatedAtVO.value; }

    update(data: Partial<Omit<AddressProps, 'id'>>): void {
        if (data.street !== undefined) this.streetVO = new NameVO(data.street);
        if (data.city !== undefined) this.cityVO = new NameVO(data.city);
        if (data.country !== undefined) this.countryVO = new NameVO(data.country);
        if (data.zipCode !== undefined) this.zipVO = new NameVO(data.zipCode);
        this.touch();
    }

    private touch(): void {
        this.updatedAtVO = DateVO.now();
    }
}

export default AddressEntity;
