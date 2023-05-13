import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3304, () => {
    console.log(`App listening on port 3306`);
  });
}

bootstrap();
