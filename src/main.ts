//main.ts
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import helmet from 'helmet';
import { createSession } from './infrastructure/session/session.config';
import { RedisService } from './infrastructure/cache/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisService = app.get(RedisService);
  const redisClient = redisService.createClient();

  redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('ready', () => {
    console.log('✅ Redis is ready to accept commands');
  });

  try {
    await redisClient.connect();
    console.log('✅ Redis client connected');

    // Test Redis connection
    await redisClient.set('test-key', 'test-value');
    const testValue = await redisClient.get('test-key');
    console.log('✅ Redis test successful, value:', testValue);
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
  }

  app.use(createSession(redisClient));

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableShutdownHooks();
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap();
