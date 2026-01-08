import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import CurrentUser from '../../../auth/api/decorators/current-user.decorator';
import { CartResponseDto } from '../dtos/response';
import CartApiMapper from '../mappers/cart-api.mapper';
import {
    AddItemToCartUseCase,
    UpdateItemQuantityUseCase,
    RemoveItemUseCase,
    GetCartUseCase,
    ClearCartUseCase,
} from '../../app/usecases';
import { CartEntity } from '../../domain/entity/cart.entity';
import type { AddItemDto } from '../dtos/request/add-item.dto';
import { UpdateItemDto } from '../dtos/request/update-item.dto';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import type { AuthUserPayload } from '../../../shared/interfaces/auth-user-payload.interface';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('cart')
export class CartController {
    constructor(
        private readonly addItem: AddItemToCartUseCase,
        private readonly updateItemQuantity: UpdateItemQuantityUseCase,
        private readonly removeItem: RemoveItemUseCase,
        private readonly getCartUseCase: GetCartUseCase,
        private readonly clearCartUseCase: ClearCartUseCase,
    ) { }

    @Get()
    @ResponseMessage('Cart retrieved successfully')
    @ApiOperation({ summary: 'Obtener el carrito del usuario autenticado' })
    @ApiResponse({ status: 200, type: CartResponseDto, description: 'Carrito recuperado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async getCart(@CurrentUser() user: AuthUserPayload): Promise<CartResponseDto> {
        const query = CartApiMapper.toGetQuery(user.sub);
        const cart = await this.getCartUseCase.execute(query);
        const entity = cart ?? CartEntity.create({ userId: user.sub, items: [] });
        return CartApiMapper.toResponse(entity);
    }

    @Post('items')
    @ResponseMessage('Item added to cart successfully')
    @ApiOperation({ summary: 'Agregar un producto al carrito' })
    @ApiResponse({ status: 201, type: CartResponseDto, description: 'Producto agregado' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o stock insuficiente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 409, description: 'El producto ya existe en el carrito' })
    async addItemToCart(
        @CurrentUser() user: AuthUserPayload,
        @Body() dto: AddItemDto,
    ): Promise<CartResponseDto> {
        const command = CartApiMapper.toAddCommand(user.sub, dto);
        const cart = await this.addItem.execute(command);
        return CartApiMapper.toResponse(cart);
    }

    @Put('items/:productId')
    @ResponseMessage('Item quantity updated successfully')
    @ApiOperation({ summary: 'Actualizar la cantidad de un producto en el carrito' })
    @ApiResponse({ status: 200, type: CartResponseDto, description: 'Cantidad actualizada' })
    @ApiResponse({ status: 400, description: 'Cantidad inválida o stock insuficiente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado en el carrito' })
    async updateItem(
        @CurrentUser() user: AuthUserPayload,
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: UpdateItemDto,
    ): Promise<CartResponseDto> {
        const command = CartApiMapper.toUpdateCommand(user.sub, productId, dto);
        const cart = await this.updateItemQuantity.execute(command);
        return CartApiMapper.toResponse(cart);
    }

    @Delete('items/:productId')
    @ResponseMessage('Item removed from cart successfully')
    @ApiOperation({ summary: 'Eliminar un producto del carrito' })
    @ApiResponse({ status: 200, type: CartResponseDto, description: 'Producto eliminado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado en el carrito' })
    async removeItemFromCart(
        @CurrentUser() user: AuthUserPayload,
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<CartResponseDto> {
        const command = CartApiMapper.toRemoveCommand(user.sub, productId);
        const cart = await this.removeItem.execute(command);
        return CartApiMapper.toResponse(cart);
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Cart cleared successfully')
    @ApiOperation({ summary: 'Vaciar el carrito del usuario' })
    @ApiResponse({ status: 200, description: 'Carrito vaciado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async clear(@CurrentUser() user: AuthUserPayload): Promise<void> {
        const command = CartApiMapper.toClearCommand(user.sub);
        await this.clearCartUseCase.execute(command);
    }
}
