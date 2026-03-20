// src/common/helpers/paginate.helper.ts
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginationResult } from '../interfaces/pagination.interface';

export async function paginate<T>(
  model: any,
  paginationDto: PaginationDto,
  options?: {
    where?: Prisma.Enumerable<any>;
    include?: any;
    select?: any;
  },
): Promise<PaginationResult<T>> {
  const { page, limit, sortBy, order } = paginationDto;

  const skip = (page - 1) * limit;
  const take = limit;

  const [data, total] = await Promise.all([
    model.findMany({
      skip,
      take,
      orderBy: sortBy ? { [sortBy]: order } : undefined,
      where: options?.where,
      include: options?.include,
      select: options?.select,
    }),
    model.count({
      where: options?.where,
    }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
