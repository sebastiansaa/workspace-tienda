import { ApiProperty } from '@nestjs/swagger';
import { ResponseProductDto } from './response-product.dto';

export class ListResponseProductDto {
    @ApiProperty({ type: [ResponseProductDto] })
    readonly products: ResponseProductDto[];

    @ApiProperty({ example: 42 })
    readonly total: number;
}
