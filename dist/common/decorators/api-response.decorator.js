"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseDecorator = ApiResponseDecorator;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function ApiResponseDecorator() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid input data',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                error: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'number', example: 400 },
                        message: { type: 'string', example: 'Validation failed' },
                        timestamp: { type: 'string', example: '2025-07-10T10:30:00.000Z' },
                    },
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal Server Error',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                error: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'number', example: 500 },
                        message: { type: 'string', example: 'Internal server error' },
                        timestamp: { type: 'string', example: '2025-07-10T10:30:00.000Z' },
                    },
                },
            },
        },
    }));
}
//# sourceMappingURL=api-response.decorator.js.map