import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockMovementResponseDto, StockResponseDto, AdjustStockDto } from '../dtos';
import InventoryApiMapper from '../mappers/inventory-api.mapper';
import { DecreaseStockUsecase, GetStockUsecase, IncreaseStockUsecase, ListMovementsUsecase, ReleaseStockUsecase, ReserveStockUsecase } from '../../app/usecases';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';

@ApiTags('inventory')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('inventory')
export class InventoryController {
    constructor(
        private readonly increaseStock: IncreaseStockUsecase,
        private readonly decreaseStock: DecreaseStockUsecase,
        private readonly reserveStock: ReserveStockUsecase,
        private readonly releaseStock: ReleaseStockUsecase,
        private readonly getStock: GetStockUsecase,
        private readonly listMovements: ListMovementsUsecase,
    ) { }

    @Get(':productId')
    @ResponseMessage('Stock information retrieved successfully')
    @ApiOperation({ summary: 'Get stock for a product' })
    @ApiResponse({ status: 200, type: StockResponseDto })
    @ApiResponse({ status: 404, description: 'Stock not found for product' })
    async getByProduct(
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<StockResponseDto> {
        const query = InventoryApiMapper.toGetStockQuery(productId);
        const entity = await this.getStock.execute(query);
        if (!entity) throw new NotFoundException('Inventory not found for product');
        return InventoryApiMapper.toStockResponseDto(entity);
    }

    @Post(':productId/increase')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ResponseMessage('Inventory increased successfully')
    @ApiOperation({ summary: 'Increase stock for a product (admin)' })
    @ApiResponse({ status: 200, type: StockResponseDto })
    async increase(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: AdjustStockDto,
    ): Promise<StockResponseDto> {
        const command = InventoryApiMapper.toIncreaseStockCommand(productId, dto);
        const entity = await this.increaseStock.execute(command);
        return InventoryApiMapper.toStockResponseDto(entity);
    }

    @Post(':productId/decrease')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ResponseMessage('Inventory decreased successfully')
    @ApiOperation({ summary: 'Decrease stock for a product (admin)' })
    @ApiResponse({ status: 200, type: StockResponseDto })
    async decrease(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: AdjustStockDto,
    ): Promise<StockResponseDto> {
        const command = InventoryApiMapper.toDecreaseStockCommand(productId, dto);
        const entity = await this.decreaseStock.execute(command);
        return InventoryApiMapper.toStockResponseDto(entity);
    }

    @Post(':productId/reserve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ResponseMessage('Inventory reserved successfully')
    @ApiOperation({ summary: 'Reserve stock for a product (admin)' })
    @ApiResponse({ status: 200, type: StockResponseDto })
    async reserve(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: AdjustStockDto,
    ): Promise<StockResponseDto> {
        const command = InventoryApiMapper.toReserveStockCommand(productId, dto);
        const entity = await this.reserveStock.execute(command);
        return InventoryApiMapper.toStockResponseDto(entity);
    }

    @Post(':productId/release')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ResponseMessage('Inventory release applied successfully')
    @ApiOperation({ summary: 'Release reserved stock for a product (admin)' })
    @ApiResponse({ status: 200, type: StockResponseDto })
    async release(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: AdjustStockDto,
    ): Promise<StockResponseDto> {
        const command = InventoryApiMapper.toReleaseStockCommand(productId, dto);
        const entity = await this.releaseStock.execute(command);
        return InventoryApiMapper.toStockResponseDto(entity);
    }

    @Get(':productId/movements')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ResponseMessage('Stock movements retrieved successfully')
    @ApiOperation({ summary: 'List stock movements for a product (admin)' })
    @ApiResponse({ status: 200, type: [StockMovementResponseDto] })
    async listMovementsByProduct(
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<StockMovementResponseDto[]> {
        const query = InventoryApiMapper.toListMovementsQuery(productId);
        const movements = await this.listMovements.execute(query);
        return InventoryApiMapper.toMovementResponseDtoList(movements);
    }
}
