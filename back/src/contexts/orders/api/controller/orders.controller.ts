import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';
import { CreateOrderFromItemsDto, OrderResponseDto } from '../dtos';
import OrderApiMapper from '../mappers/order-api.mapper';
import {
    CreateOrderFromCartUsecase,
    CreateOrderFromItemsUsecase,
    GetOrderByIdUsecase,
    ListOrdersForUserUsecase,
    CancelOrderUsecase,
    MarkOrderAsPaidUsecase,
    ListAllOrdersUsecase,
    AdminGetOrderByIdUsecase,
    AdminMarkOrderAsCompletedUsecase,
} from '../../app/usecases';
import CurrentUser from '../../../auth/api/decorators/current-user.decorator';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import type { AuthUserPayload } from '../../../shared/interfaces/auth-user-payload.interface';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly createFromCart: CreateOrderFromCartUsecase,
        private readonly createFromItems: CreateOrderFromItemsUsecase,
        private readonly getOrderById: GetOrderByIdUsecase,
        private readonly listOrdersForUser: ListOrdersForUserUsecase,
        private readonly cancelOrderUsecase: CancelOrderUsecase,
        private readonly markOrderAsPaidUsecase: MarkOrderAsPaidUsecase,
        private readonly listAllOrders: ListAllOrdersUsecase,
        private readonly adminGetOrderById: AdminGetOrderByIdUsecase,
        private readonly adminMarkAsCompleted: AdminMarkOrderAsCompletedUsecase,
    ) { }

    @Post('from-cart')
    @ResponseMessage('Order created from cart successfully')
    @ApiOperation({ summary: 'Crear una orden a partir del carrito del usuario autenticado' })
    @ApiResponse({ status: 201, type: OrderResponseDto, description: 'Orden creada desde carrito' })
    @ApiResponse({ status: 400, description: 'Carrito vacío o productos no disponibles' })
    @ApiResponse({ status: 409, description: 'Estado inválido de la orden' })
    async createFromCartHandler(@CurrentUser() user: AuthUserPayload): Promise<OrderResponseDto> {
        const command = OrderApiMapper.toCreateFromCartCommand(user.sub);
        const order = await this.createFromCart.execute(command);
        return OrderApiMapper.toResponse(order);
    }

    @Post()
    @ResponseMessage('Order created successfully')
    @ApiOperation({ summary: 'Crear una orden con items específicos' })
    @ApiResponse({ status: 201, type: OrderResponseDto, description: 'Orden creada con items' })
    @ApiResponse({ status: 400, description: 'Items inválidos o sin stock' })
    @ApiResponse({ status: 409, description: 'Estado inválido de la orden' })
    async createFromItemsHandler(
        @CurrentUser() user: AuthUserPayload,
        @Body() dto: CreateOrderFromItemsDto,
    ): Promise<OrderResponseDto> {
        const command = OrderApiMapper.toCreateFromItemsCommand(user.sub, dto);
        const order = await this.createFromItems.execute(command);
        return OrderApiMapper.toResponse(order);
    }

    @Get()
    @ResponseMessage('User orders retrieved successfully')
    @ApiOperation({ summary: 'Listar órdenes del usuario autenticado' })
    @ApiResponse({ status: 200, type: [OrderResponseDto] })
    async list(@CurrentUser() user: AuthUserPayload): Promise<OrderResponseDto[]> {
        const query = { userId: user.sub } as const;
        const orders = await this.listOrdersForUser.execute(query);
        return orders.map((o) => OrderApiMapper.toResponse(o));
    }

    @Get(':id')
    @ResponseMessage('Order details retrieved successfully')
    @ApiOperation({ summary: 'Obtener una orden por ID (propiedad requerida)' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    @ApiResponse({ status: 404, description: 'Order not found' })
    async getById(
        @CurrentUser() user: AuthUserPayload,
        @Param('id') id: string,
    ): Promise<OrderResponseDto> {
        const query = { orderId: id, userId: user.sub } as const;
        const order = await this.getOrderById.execute(query);
        if (!order) throw new NotFoundException('Order not found');
        return OrderApiMapper.toResponse(order);
    }

    @Patch(':id/cancel')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Order cancelled successfully')
    @ApiOperation({ summary: 'Cancelar una orden en estado PENDING' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Estado inválido para cancelar' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    async cancel(
        @CurrentUser() user: AuthUserPayload,
        @Param('id') id: string,
    ): Promise<OrderResponseDto> {
        const command = { orderId: id, userId: user.sub };
        const order = await this.cancelOrderUsecase.execute(command);
        if (!order) throw new NotFoundException('Order not found');
        return OrderApiMapper.toResponse(order);
    }

    @Patch(':id/pay')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Order marked as paid successfully')
    @ApiOperation({ summary: 'Marcar una orden como pagada' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Estado inválido para pagar' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    async markPaid(
        @CurrentUser() user: AuthUserPayload,
        @Param('id') id: string,
    ): Promise<OrderResponseDto> {
        const command = { orderId: id, userId: user.sub };
        const order = await this.markOrderAsPaidUsecase.execute(command);
        if (!order) throw new NotFoundException('Order not found');
        return OrderApiMapper.toResponse(order);
    }

    @Get('admin/list')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ResponseMessage('Orders listed successfully')
    @ApiOperation({ summary: 'Listar todas las órdenes (admin)' })
    @ApiResponse({ status: 200, type: [OrderResponseDto] })
    async listAll(): Promise<OrderResponseDto[]> {
        const orders = await this.listAllOrders.execute();
        return orders.map((o) => OrderApiMapper.toResponse(o));
    }

    @Get('admin/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ResponseMessage('Order retrieved successfully')
    @ApiOperation({ summary: 'Obtener detalle de orden (admin)' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async getByIdAdmin(@Param('id') id: string): Promise<OrderResponseDto> {
        const order = await this.adminGetOrderById.execute(id);
        if (!order) throw new NotFoundException('Order not found');
        return OrderApiMapper.toResponse(order);
    }

    @Patch('admin/:id/complete')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Order completed successfully')
    @ApiOperation({ summary: 'Marcar orden como completada (admin)' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async complete(@Param('id') id: string): Promise<OrderResponseDto> {
        const order = await this.adminMarkAsCompleted.execute(id);
        if (!order) throw new NotFoundException('Order not found');
        return OrderApiMapper.toResponse(order);
    }
}
