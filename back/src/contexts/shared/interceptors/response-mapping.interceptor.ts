import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

/**
 * Interceptor global para envolver todas las respuestas exitosas en un formato común.
 * Extrae el mensaje del decorador @ResponseMessage y asegura que data nunca sea undefined.
 */
@Injectable()
export class ResponseMappingInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    constructor(private reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        // Recupera el mensaje personalizado definido en el controlador o usa uno por defecto
        const message = this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || 'Operation successful';
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return next.handle().pipe(
            map((data) => ({
                statusCode,
                message,
                data: data !== undefined ? data : null,
            })),
        );
    }
}
