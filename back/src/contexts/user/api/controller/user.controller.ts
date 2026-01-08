import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import CurrentUser from '../../../auth/api/decorators/current-user.decorator';
import { AddressDto, UpdateUserProfileDto, UserResponseDto } from '../dtos';
import UserApiMapper from '../mappers/user-api.mapper';
import {
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    AddAddressUseCase,
    UpdateAddressUseCase,
    DeleteAddressUseCase,
    ListUsersUseCase,
    ChangeUserStatusUseCase,
} from '../../app/usecases';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import type { AuthUserPayload } from '../../../shared/interfaces/auth-user-payload.interface';
import { Roles } from '../../../auth/api/decorators/roles.decorator';
import { ChangeStatusDto } from '../dtos';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('users')
export class UserController {
    constructor(
        private readonly getProfile: GetUserProfileUseCase,
        private readonly updateProfile: UpdateUserProfileUseCase,
        private readonly addAddress: AddAddressUseCase,
        private readonly updateAddress: UpdateAddressUseCase,
        private readonly deleteAddress: DeleteAddressUseCase,
        private readonly listUsers: ListUsersUseCase,
        private readonly changeStatus: ChangeUserStatusUseCase,
    ) { }

    @Get('me')
    @ResponseMessage('User profile retrieved successfully')
    @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async me(@CurrentUser() user: AuthUserPayload): Promise<UserResponseDto> {
        const profile = await this.getProfile.execute(user.sub);
        return UserApiMapper.toUserResponse(profile);
    }

    @Patch('me')
    @ResponseMessage('User profile updated successfully')
    @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async updateMe(@CurrentUser() user: AuthUserPayload, @Body() dto: UpdateUserProfileDto): Promise<UserResponseDto> {
        const command = UserApiMapper.toUpdateProfileCommand(user.sub, dto);
        const updated = await this.updateProfile.execute(command);
        return UserApiMapper.toUserResponse(updated);
    }

    @Post('me/addresses')
    @ResponseMessage('Address added successfully')
    @ApiOperation({ summary: 'Agregar dirección al usuario autenticado' })
    @ApiResponse({ status: 201, type: UserResponseDto })
    async addAddr(@CurrentUser() user: AuthUserPayload, @Body() dto: AddressDto): Promise<UserResponseDto> {
        const command = UserApiMapper.toAddAddressCommand(user.sub, dto);
        await this.addAddress.execute(command);
        const refreshed = await this.getProfile.execute(user.sub);
        return UserApiMapper.toUserResponse(refreshed);
    }

    @Patch('me/addresses/:id')
    @ResponseMessage('Address updated successfully')
    @ApiOperation({ summary: 'Actualizar dirección del usuario autenticado' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async updateAddr(
        @CurrentUser() user: AuthUserPayload,
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() dto: AddressDto,
    ): Promise<UserResponseDto> {
        const command = UserApiMapper.toUpdateAddressCommand(user.sub, id, dto);
        await this.updateAddress.execute(command);
        const refreshed = await this.getProfile.execute(user.sub);
        return UserApiMapper.toUserResponse(refreshed);
    }

    @Delete('me/addresses/:id')
    @ResponseMessage('Address deleted successfully')
    @ApiOperation({ summary: 'Eliminar dirección del usuario autenticado' })
    @ApiResponse({ status: 204 })
    async deleteAddr(
        @CurrentUser() user: AuthUserPayload,
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<void> {
        const command = UserApiMapper.toDeleteAddressCommand(user.sub, id);
        await this.deleteAddress.execute(command);
    }


    @Get('admin/list')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ResponseMessage('Users listed successfully')
    @ApiOperation({ summary: 'Listar usuarios (admin)' })
    @ApiResponse({ status: 200, type: [UserResponseDto] })
    async list(): Promise<UserResponseDto[]> {
        const users = await this.listUsers.execute();
        return UserApiMapper.toUserResponseList(users);
    }

    @Get('admin/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ResponseMessage('User profile retrieved successfully')
    @ApiOperation({ summary: 'Obtener perfil de usuario (admin)' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async getById(@Param('id') id: string): Promise<UserResponseDto> {
        const user = await this.getProfile.execute(id);
        return UserApiMapper.toUserResponse(user);
    }

    @Patch('admin/:id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ResponseMessage('User status updated successfully')
    @ApiOperation({ summary: 'Cambiar estado de usuario (admin)' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async changeUserStatus(@Param('id') id: string, @Body() dto: ChangeStatusDto): Promise<UserResponseDto> {
        const command = UserApiMapper.toChangeStatusCommand(id, dto.status);
        const user = await this.changeStatus.execute(command);
        return UserApiMapper.toUserResponse(user);
    }
}
