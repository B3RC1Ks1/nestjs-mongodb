import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiKeyGuard } from 'src/guard/Api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 7856;
  app.useGlobalGuards(new ApiKeyGuard());
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
