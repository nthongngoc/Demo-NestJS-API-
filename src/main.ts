import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigsService } from './configs/configs.service';

const configsService = new ConfigsService()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Nestjs project')
    .setDescription('Nestjs API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(configsService.port, configsService.host);
  console.log(`our app started at ${configsService.host}:${configsService.port}`);

}
bootstrap();
