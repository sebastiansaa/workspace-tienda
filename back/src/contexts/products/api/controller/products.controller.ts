import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateStockRequestDto, SearchProductsRequestDto, ListProductsRequestDto, SaveProductRequestDto } from '../dtos/request';
import { ListResponseProductDto, ResponseProductDto } from '../dtos/response';
import { ProductApiMapper } from '../mappers/product-api.mapper';
import {
  FindProductByIdUsecase,
  ListProductsUsecase,
  SearchProductsUsecase,
  SaveProductUsecase,
  DeleteProductUsecase,
  RestoreProductUsecase,
  FindLowStockUsecase,
  UpdateStockUsecase,
} from '../../app/usecases';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';

/**
 * Controlador para la exposición pública del catálogo de productos.
 * Permite la búsqueda, filtrado y visualización detallada de productos para los clientes.
 */
@ApiTags('products')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('products')
export class ProductsController {
  constructor(
    private readonly findProductByIdUsecase: FindProductByIdUsecase,
    private readonly listProductsUsecase: ListProductsUsecase,
    private readonly searchProductsUsecase: SearchProductsUsecase,
    private readonly saveProductUsecase: SaveProductUsecase,
    private readonly deleteProductUsecase: DeleteProductUsecase,
    private readonly restoreProductUsecase: RestoreProductUsecase,
    private readonly findLowStockUsecase: FindLowStockUsecase,
    private readonly updateStockUsecase: UpdateStockUsecase,
  ) { }

  /**
   * Obtiene una lista paginada de productos activos.
   * Soporta filtrado opcional por categoría mediante IDs válidos.
   */
  @Get()
  @ResponseMessage('Products retrieved successfully')
  @ApiOperation({ summary: 'Listar productos con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Productos recuperados exitosamente', type: ListResponseProductDto })
  @ApiResponse({ status: 400, description: 'Parámetros de consulta inválidos' })
  async list(@Query() dto: ListProductsRequestDto): Promise<ListResponseProductDto> {
    const query = ProductApiMapper.toListProductsQuery(dto);
    const { products, total } = await this.listProductsUsecase.execute(query);
    return {
      products: ProductApiMapper.toResponseDtoList(products),
      total,
    };
  }

  /**
   * Busca productos utilizando un término de búsqueda global.
   * La búsqueda se realiza de forma optimizada sobre títulos y descripciones.
   */
  @Get('search')
  @ResponseMessage('Products search results retrieved successfully')
  @ApiOperation({ summary: 'Buscar productos por nombre o descripción' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda recuperados', type: ListResponseProductDto })
  @ApiResponse({ status: 400, description: 'Término de búsqueda inválido' })
  async search(@Query() dto: SearchProductsRequestDto): Promise<ListResponseProductDto> {
    const query = ProductApiMapper.toSearchProductsQuery(dto);
    const { products, total } = await this.searchProductsUsecase.execute(query);
    return {
      products: ProductApiMapper.toResponseDtoList(products),
      total,
    };
  }

  /**
   * Obtiene el detalle extendido de un producto específico.
   * Retorna null o lanza un error 404 si el producto no existe en el catálogo.
   */
  @Get(':id')
  @ResponseMessage('Product details retrieved successfully')
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: ResponseProductDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'ID de producto inválido' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ResponseProductDto | null> {
    const query = ProductApiMapper.toFindProductByIdQuery(id);
    const entity = await this.findProductByIdUsecase.execute(query);
    return entity ? ProductApiMapper.toResponseDto(entity) : null;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ResponseMessage('Product saved successfully')
  @ApiOperation({ summary: 'Crear o actualizar producto (admin)' })
  @ApiResponse({ status: 201, type: ResponseProductDto })
  async save(@Body() dto: SaveProductRequestDto): Promise<ResponseProductDto> {
    const command = ProductApiMapper.toSaveProductCommand(dto);
    const product = await this.saveProductUsecase.execute(command);
    return ProductApiMapper.toResponseDto(product);
  }

  @Get('admin/low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ResponseMessage('Low stock products retrieved successfully')
  @ApiOperation({ summary: 'Productos con bajo stock (admin)' })
  @ApiResponse({ status: 200, type: [ResponseProductDto] })
  async findLowStock(@Query('threshold', ParseIntPipe) threshold: number = 5): Promise<ResponseProductDto[]> {
    const query = ProductApiMapper.toFindLowStockQuery(threshold);
    const products = await this.findLowStockUsecase.execute(query);
    return ProductApiMapper.toResponseDtoList(products);
  }

  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ResponseMessage('Product stock updated successfully')
  @ApiOperation({ summary: 'Actualizar stock del producto (admin)' })
  @ApiResponse({ status: 200, description: 'Stock actualizado', type: ResponseProductDto })
  @ApiResponse({ status: 400, description: 'Cantidad inválida' })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockRequestDto,
  ): Promise<ResponseProductDto> {
    const command = ProductApiMapper.toUpdateStockCommand(id, dto.quantity);
    const product = await this.updateStockUsecase.execute(command);
    return ProductApiMapper.toResponseDto(product);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ResponseMessage('Product deleted successfully')
  @ApiOperation({ summary: 'Eliminar producto (admin)' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number, @Query('hard') hard?: string): Promise<void> {
    const command = ProductApiMapper.toDeleteProductCommand(id, hard !== 'true');
    await this.deleteProductUsecase.execute(command);
  }

  @Post(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ResponseMessage('Product restored successfully')
  @ApiOperation({ summary: 'Restaurar producto (admin)' })
  @ApiResponse({ status: 200, type: ResponseProductDto })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<ResponseProductDto> {
    const command = ProductApiMapper.toRestoreProductCommand(id);
    const product = await this.restoreProductUsecase.execute(command);
    return ProductApiMapper.toResponseDto(product);
  }

  @Post(':id/upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ResponseMessage('Product image uploaded successfully')
  @ApiOperation({ summary: 'Subir imagen de producto (admin)' })
  @ApiResponse({ status: 200, description: 'Imagen subida correctamente' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      productId: id,
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }
}
