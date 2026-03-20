import { Prisma, TaskStatus } from 'generated/prisma/client';

export class FilterBuilder {
  private andConditions: Prisma.TaskWhereInput[] = [];
  private orConditions: Prisma.TaskWhereInput[] = [];

  assignee(userId?: string) {
    if (!userId) return this;

    this.andConditions.push({
      assignees: {
        some: { userId },
      },
    });

    return this;
  }

  dueDate(from?: Date, to?: Date) {
    if (!from && !to) return this;

    this.andConditions.push({
      dueDate: {
        gte: from,
        lte: to,
      },
    });

    return this;
  }

  keyword(keyword?: string) {
    if (!keyword) return this;

    const keywords = keyword.split(' ');

    this.andConditions.push({
      AND: keywords.map((k) => ({
        OR: [
          { title: { contains: k, mode: 'insensitive' } },
          { description: { contains: k, mode: 'insensitive' } },
        ],
      })),
    });

    return this;
  }

  softDelete() {
    this.andConditions.push({
      deletedAt: null,
    });

    return this;
  }

  status(status?: TaskStatus) {
    if (!status) return this;

    this.andConditions.push({ status });

    return this;
  }

  workspaceId(workspaceId?: string) {
    if (!workspaceId) return this;

    this.andConditions.push({
      project: {
        workspaceId,
      },
    });

    return this;
  }

  build(): Prisma.TaskWhereInput {
    const where: Prisma.TaskWhereInput = {};

    if (this.andConditions.length > 0) {
      where.AND = this.andConditions;
    }

    if (this.orConditions.length > 0) {
      where.OR = this.orConditions;
    }

    return where;
  }
}
