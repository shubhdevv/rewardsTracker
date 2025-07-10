"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Rewards API')
        .setDescription('A comprehensive rewards management API with user points tracking, transactions, and redemption functionality')
        .setVersion('1.0')
        .addTag('rewards', 'Rewards management endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(8000, '0.0.0.0');
    console.log('Rewards API is running on http://0.0.0.0:8000');
    console.log('Swagger documentation available at http://0.0.0.0:8000/api-docs');
}
bootstrap();
//# sourceMappingURL=main.js.map