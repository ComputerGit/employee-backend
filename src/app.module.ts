import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './modules/employee/employee.module';
import { HealthModule } from './health/health.module';
import { TerminusModule } from '@nestjs/terminus';
import { GracefulShutdownService } from './infrastructure/lifecycle/graceful-shutdown.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { CacheModule } from './infrastructure/cache/cache.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 🌍 Global config (ENV access everywhere)
    ConfigModule.forRoot({ isGlobal: true }),
    // 🧠 MongoDB connection (ROOT ONLY)
    MongooseModule.forRoot(process.env.MONGO_URI!),

    // 🚦 Rate limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 100,
        },
      ],
    }),
    // 📦 Feature modules
    TerminusModule,
    CacheModule,
    HealthModule,
    EmployeeModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    Reflector,
    GracefulShutdownService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
