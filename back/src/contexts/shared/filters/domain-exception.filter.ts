import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Filtro global para capturar y estandarizar todas las excepciones de la aplicación.
 * Mapea errores de dominio, lógica de negocio y excepciones HTTP a un formato JSON uniforme.
 */
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(DomainExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorName = 'InternalServerError';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            } else if (res && typeof res === 'object' && 'message' in res) {
                const payload = res as { message?: string | string[] };
                message = Array.isArray(payload.message) ? payload.message.join(', ') : payload.message ?? exception.message;
            } else {
                message = exception.message;
            }
            errorName = exception.name;
        } else if (exception instanceof Error) {
            errorName = exception.name;
            message = exception.message;

            // Mapeo dinámico de errores de dominio a estados HTTP basado en el nombre de la clase
            const name = exception.constructor.name;

            if (name.includes('NotFound') || name.includes('OwnershipError')) {
                status = HttpStatus.NOT_FOUND;
            } else if (name.includes('AlreadyExists') || name.includes('Conflict') || name.includes('Duplicate')) {
                status = HttpStatus.CONFLICT;
            } else if (name.includes('Invalid') || name.includes('Invariants') || name.includes('Negative') || name.includes('Insufficient') || name.includes('Empty')) {
                status = HttpStatus.BAD_REQUEST;
            } else if (name.includes('Credentials') || name.includes('Unauthorized') || name.includes('Expired')) {
                status = HttpStatus.UNAUTHORIZED;
            } else if (name.includes('Forbidden') || name.includes('AccessDenied')) {
                status = HttpStatus.FORBIDDEN;
            }
        }

        // Registro de errores inesperados para monitoreo
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            const stack = exception instanceof Error ? exception.stack : undefined;
            this.logger.error(`${request.method} ${request.url}`, stack);
        }

        // Estructura de respuesta de error unificada
        response.status(status).json({
            statusCode: status,
            message: message,
            data: null,
            error: errorName,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
