import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import CurrentUser from '../../../auth/api/decorators/current-user.decorator';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import type { AuthUserPayload } from '../../../shared/interfaces/auth-user-payload.interface';
import { CreateReviewRequestDto } from '../dtos/request/create-review.request.dto';
import { ListProductReviewsRequestDto } from '../dtos/request/list-product-reviews.request.dto';
import { ListUserReviewsRequestDto } from '../dtos/request/list-user-reviews.request.dto';
import { ReviewPrivateResponseDto } from '../dtos/response/review-private.response.dto';
import { ReviewPrivateListResponseDto } from '../dtos/response/review-private-list.response.dto';
import { ReviewPublicListResponseDto } from '../dtos/response/review-public-list.response.dto';
import { ReviewProductSummaryResponseDto } from '../dtos/response/review-product-summary.response.dto';
import { ReviewApiMapper } from '../mappers/review-api.mapper';
import { UpdateReviewRequestDto } from '../dtos/request/update-review.request.dto';
import { CreateReviewUseCase, DeleteReviewUseCase, GetProductRatingSummaryUseCase, GetProductReviewsUseCase, GetReviewByIdUseCase, GetUserReviewsUseCase, UpdateReviewUseCase } from '../../app/usecases';
import { DeleteReviewCommand } from '../../app/commands';

@ApiTags('reviews')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly createReview: CreateReviewUseCase,
        private readonly deleteReview: DeleteReviewUseCase,
        private readonly productReviews: GetProductReviewsUseCase,
        private readonly userReviews: GetUserReviewsUseCase,
        private readonly reviewById: GetReviewByIdUseCase,
        private readonly updateReview: UpdateReviewUseCase,
        private readonly productRatingSummary: GetProductRatingSummaryUseCase,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ResponseMessage('Review created successfully')
    @ApiOperation({ summary: 'Crear review para un producto (requiere compra previa)' })
    @ApiResponse({ status: 201, type: ReviewPrivateResponseDto })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
    @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado o compra inexistente' })
    @ApiResponse({ status: 409, description: 'Conflicto de reseña existente' })
    async create(
        @CurrentUser() user: AuthUserPayload,
        @Body() dto: CreateReviewRequestDto,
    ): Promise<ReviewPrivateResponseDto> {
        const command = ReviewApiMapper.toCreateReviewCommand(dto, user.sub);
        const review = await this.createReview.execute(command);
        return ReviewApiMapper.toPrivateDto(review);
    }

    @Get('product/:productId')
    @ResponseMessage('Product reviews retrieved successfully')
    @ApiOperation({ summary: 'Listar reviews públicas de un producto' })
    @ApiResponse({ status: 200, type: ReviewPublicListResponseDto })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página a recuperar', example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de registros por página', example: 20 })
    @ApiParam({ name: 'productId', type: Number, description: 'Identificador del producto' })
    async listByProduct(
        @Param('productId', ParseIntPipe) productId: number,
        @Query() dto: ListProductReviewsRequestDto,
    ): Promise<ReviewPublicListResponseDto> {
        const query = ReviewApiMapper.toProductReviewsQuery(productId, dto);
        const result = await this.productReviews.execute(query);
        return ReviewApiMapper.toPublicList(result);
    }

    @Get('product/:productId/summary')
    @ResponseMessage('Product review summary retrieved successfully')
    @ApiOperation({ summary: 'Obtener resumen de ratings de un producto' })
    @ApiResponse({ status: 200, type: ReviewProductSummaryResponseDto })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiParam({ name: 'productId', type: Number, description: 'Identificador del producto' })
    async summaryByProduct(
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<ReviewProductSummaryResponseDto> {
        const query = ReviewApiMapper.toProductRatingSummaryQuery(productId);
        const result = await this.productRatingSummary.execute(query);
        return ReviewApiMapper.toSummaryDto(result);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ResponseMessage('User reviews retrieved successfully')
    @ApiOperation({ summary: 'Listar reviews creadas por el usuario autenticado' })
    @ApiResponse({ status: 200, type: ReviewPrivateListResponseDto })
    @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página a recuperar', example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de registros por página', example: 20 })
    async listMine(
        @CurrentUser() user: AuthUserPayload,
        @Query() dto: ListUserReviewsRequestDto,
    ): Promise<ReviewPrivateListResponseDto> {
        const query = ReviewApiMapper.toUserReviewsQuery(user.sub, dto);
        const result = await this.userReviews.execute(query);
        return ReviewApiMapper.toPrivateList(result);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ResponseMessage('Review retrieved successfully')
    @ApiOperation({ summary: 'Obtener detalle privado de una reseña propia' })
    @ApiResponse({ status: 200, type: ReviewPrivateResponseDto })
    @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
    @ApiResponse({ status: 404, description: 'Reseña no encontrada o sin permisos' })
    @ApiParam({ name: 'id', type: String, description: 'Identificador UUID de la reseña' })
    async getById(
        @CurrentUser() user: AuthUserPayload,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ReviewPrivateResponseDto> {
        const query = ReviewApiMapper.toReviewByIdQuery(id, user.sub);
        const review = await this.reviewById.execute(query);
        return ReviewApiMapper.toPrivateDto(review);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ResponseMessage('Review updated successfully')
    @ApiOperation({ summary: 'Actualizar reseña propia' })
    @ApiResponse({ status: 200, type: ReviewPrivateResponseDto })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
    @ApiResponse({ status: 404, description: 'Reseña no encontrada o sin permisos' })
    @ApiParam({ name: 'id', type: String, description: 'Identificador UUID de la reseña' })
    async update(
        @CurrentUser() user: AuthUserPayload,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateReviewRequestDto,
    ): Promise<ReviewPrivateResponseDto> {
        const command = ReviewApiMapper.toUpdateReviewCommand(id, user.sub, dto);
        const review = await this.updateReview.execute(command);
        return ReviewApiMapper.toPrivateDto(review);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ResponseMessage('Review deleted successfully')
    @ApiOperation({ summary: 'Eliminar review propia' })
    @ApiResponse({ status: 204, description: 'Reseña eliminada correctamente' })
    @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
    @ApiResponse({ status: 404, description: 'Reseña no encontrada o no pertenece al usuario' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id', type: String, description: 'Identificador UUID de la reseña' })
    async delete(
        @CurrentUser() user: AuthUserPayload,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        const command = new DeleteReviewCommand(id, user.sub);
        await this.deleteReview.execute(command);
    }
}
