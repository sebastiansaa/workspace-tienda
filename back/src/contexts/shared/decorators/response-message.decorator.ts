import { SetMetadata } from '@nestjs/common';

// Clave para almacenar el mensaje de éxito en los metadatos del método
export const RESPONSE_MESSAGE = 'response_message';

// Decorador para definir un mensaje de éxito personalizado por endpoint
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);
