import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import { GetDashboardStatsUsecase } from '../../app/usecases/get-dashboard-stats.usecase';
import { DashboardStatsResponseDto } from '../dtos/response/dashboard-stats.response.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly getDashboardStats: GetDashboardStatsUsecase,
    ) { }

    @Get('dashboard')
    @ResponseMessage('Dashboard stats retrieved successfully')
    @ApiOperation({ summary: 'Obtener estadisticas del dashboard' })
    @ApiResponse({ status: 200, type: DashboardStatsResponseDto })
    async getStats(): Promise<DashboardStatsResponseDto> {
        return this.getDashboardStats.execute();
    }
}

export default AdminController;
