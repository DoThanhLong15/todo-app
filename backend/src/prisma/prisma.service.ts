import { PrismaClient } from '@generated-prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const adapter = new PrismaPg({ connectionString: configService.get('database.url') });

    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    // Log slow queries (> 2000ms) in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore — Prisma event typing
      this.$on('query', (e: { query: string; duration: number }) => {
        if (e.duration > 2000) {
          this.logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('error', (e: { message: string }) => {
      this.logger.error(`Prisma error: ${e.message}`);
    });

    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Used for health checks — executes a simple query
   * to verify that the database connection is alive.
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Soft delete helper — sets deletedAt instead of performing a hard delete.
   * Can be used for any model that has a deletedAt field.
   *
   * Example: prisma.softDelete('task', { id: taskId })
   */
  async softDelete(
    model: keyof Omit<
      PrismaClient,
      | '$connect'
      | '$disconnect'
      | '$on'
      | '$transaction'
      | '$queryRaw'
      | '$executeRaw'
      | '$queryRawUnsafe'
      | '$executeRawUnsafe'
      | '$extends'
    >,
    where: Record<string, unknown>,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — dynamic model access
    await (this[model] as any).update({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
