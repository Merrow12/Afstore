import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://afstore.vercel.app',
      'https://afstore-git-main-merrow-s-projects.vercel.app',
      'https://afstore-la2e9p8cl-merrow-s-projects.vercel.app',
      /\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();