import { PrismaClient } from '@prisma/client';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    pageSize: number;
  };
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  orderBy?: any;
  where?: any;
  include?: any;
}

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  constructor(
    protected prisma: PrismaClient,
    protected model: any // The specific prisma model delegate
  ) {}

  async findById(id: string, include?: any): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include,
    });
  }

  async findFirst(where: any, include?: any): Promise<T | null> {
    return this.model.findFirst({
      where,
      include,
    });
  }

  async findAll(options: QueryOptions = {}): Promise<T[]> {
    const { where, orderBy, include } = options;
    return this.model.findMany({
      where,
      orderBy,
      include,
    });
  }

  async findPaginated(options: QueryOptions = {}): Promise<PaginatedResult<T>> {
    const page = Math.max(1, options.page || 1);
    const pageSize = Math.max(1, options.pageSize || 10);
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where: options.where,
        orderBy: options.orderBy,
        include: options.include,
        skip,
        take: pageSize,
      }),
      this.model.count({ where: options.where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        pageSize,
      },
    };
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }

  /**
   * Execute operations inside a transaction
   */
  async transaction<R>(fn: (prisma: PrismaClient) => Promise<R>): Promise<R> {
    return this.prisma.$transaction(fn);
  }
}
