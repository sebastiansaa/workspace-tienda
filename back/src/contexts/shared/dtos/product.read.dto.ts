export interface ProductReadDto {
    id: number;
    title: string;
    price: number;
    stock: number;
    image?: string;
    slug?: string;
}

export default ProductReadDto;
