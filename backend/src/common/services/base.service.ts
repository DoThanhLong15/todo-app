import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export abstract class BaseService {
  protected readonly logger = new Logger(this.constructor.name);

  protected async execute<T>(
    operation: () => Promise<T>,
    errorMessage = 'Something went wrong',
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.logger.error(errorMessage);

      if (error instanceof Error && 'status' in error) {
        throw error;
      }

      throw error;
    }
  }

  protected notFound(message = 'Resource not found'): never {
    throw new NotFoundException(message);
  }

  protected badRequest(message = 'Bad request'): never {
    throw new BadRequestException(message);
  }

  protected internalError(message = 'Internal server error'): never {
    throw new InternalServerErrorException(message);
  }

  protected async ensureExists<T>(
    promise: Promise<T | null>,
    message = 'Resource not found',
  ): Promise<T> {
    const result = await promise;

    if (!result) {
      this.notFound(message);
    }

    return result;
  }

  protected buildPagination(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return { skip, take: limit };
  }

  protected success<T>(data: T, message = 'Success') {
    return {
      success: true,
      message,
      data,
    };
  }
}
