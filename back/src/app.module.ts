import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './contexts/products/products.module';
import { CategoriesModule } from './contexts/categories/categories.module';
import { OrdersModule } from './contexts/orders/order.module';
import { CartModule } from './contexts/cart/cart.module';
import { AuthModule } from './contexts/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { InventoryModule } from './contexts/inventory/inventory.module';
import { PaymentModule } from './contexts/payment/payment.module';
import { UserModule } from './contexts/user/user.module';
import { AdminModule } from './contexts/admin/admin.module';
import { ReviewsModule } from './contexts/reviews/reviews.module';
import { HealthModule } from './health/health.module';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    // Configuración global de variables de entorno con validación mediante Zod
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: false,
      validate: validateEnv,
    }),
    // Caché en memoria para optimizar lecturas frecuentes
    CacheModule.register({
      ttl: 60,
      max: 100,
    }),
    // Configuración de Rate Limiting por niveles para proteger la API
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 3,
    }, {
      name: 'medium',
      ttl: 10000,
      limit: 20
    }, {
      name: 'long',
      ttl: 60000,
      limit: 100
    }]),
    // Módulos de persistencia e infraestructura
    PrismaModule,
    AuthModule,
    // Módulos de dominio de la aplicación
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CartModule,
    InventoryModule,
    PaymentModule,
    UserModule,
    AdminModule,
    ReviewsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Activación global del guardia para Rate Limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }