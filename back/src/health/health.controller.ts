import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
    @Get()
    @HttpCode(200)
    liveness() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        };
    }

    @Get('ready')
    @HttpCode(200)
    readiness() {
        return {
            status: 'ready',
        };
    }
}
