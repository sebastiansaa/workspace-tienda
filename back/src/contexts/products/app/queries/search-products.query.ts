export interface SearchProductsParams {
  readonly page?: number;
  readonly limit?: number;
}

export class SearchProductsQuery {
  constructor(public readonly term: string, public readonly params?: Readonly<SearchProductsParams>) { }
}
