# Payment Context

Responsable de la integración con pasarelas de pago virtuales y el seguimiento de transacciones vinculadas a las órdenes del sistema.

## Estructura de Carpetas

- `api/`: Controllers para inicio y confirmación de pagos por el usuario.
- `app/`: Casos de uso (iniciar pago, confirmar éxito, registrar fallo).
- `domain/`: Entidad Payment con constructor privado, factories `create/rehydrate` y métodos ricos para transicionar estados de transacción.
- `infra/`: Adaptadores para pasarelas de pago y repositorios Prisma.

## Casos de Uso y Endpoints

- `POST /payments/initiate`: Inicia una intención de pago para una orden.
- `POST /payments/:id/confirm`: Confirma la recepción del pago.
- `POST /payments/:id/fail`: Marca un pago como fallido.
- `GET /payments`: Historial de transacciones del usuario autenticado.
- `GET /payments/admin/list`: Auditoría global de pagos (requiere `@Roles('admin')`).
- `GET /payments/admin/:id`: Detalle de pago para administradores (requiere `@Roles('admin')`).

## Ejemplo de Uso

- `InitiatePaymentUsecase` depende de `PaymentWriteRepository`, `PaymentProviderPort`, `OrderPaymentReadPort` y `OrderPaymentWritePort` para sincronizar el estado de la orden con la transacción.

```typescript
// Iniciar pago de una orden
const payment = await initiateUseCase.execute({
  orderId: 'O-456',
  method: 'CREDIT_CARD',
});
// La entidad expone helpers `markAuthorized/markPaid/markFailed` para los flujos posteriores.
console.log(`Pago pendiente: ${payment.id}`);
```

## Notas de Integración

- **Seguridad**: Uso opcional de Webhooks.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Validación**: Verifica que la orden esté en estado PENDING.
- **Persistencia**: Los repositorios Prisma rehidratan la entidad vía `PaymentEntity.rehydrate` para conservar los timestamps originales.
- **Colaboraciones**: Se apoya en los puertos exportados por `OrdersContext` para validar órdenes existentes o generar órdenes de checkout sin acceder a infraestructura externa.
