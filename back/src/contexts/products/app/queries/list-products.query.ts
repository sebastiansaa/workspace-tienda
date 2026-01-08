export interface ListProductsParams {
  readonly page?: number;
  readonly limit?: number;
  readonly categoryId?: number;
}

export class ListProductsQuery {
  constructor(public readonly params?: Readonly<ListProductsParams>) { }
}
