import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiResponseDecorator() {
  return applyDecorators(
    ApiResponse({
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
    }),
    ApiResponse({
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
    }),
  );
}
