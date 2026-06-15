import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { QueryStoreDto } from './dto/query-store.dto';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto) {
    // Verify owner exists and is a STORE_OWNER
    const owner = await this.prisma.user.findUnique({
      where: { id: createStoreDto.ownerId },
    });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }
    if (owner.role !== Role.STORE_OWNER) {
      throw new BadRequestException('User must have STORE_OWNER role');
    }

    // Check if owner already has a store (1:1 relationship)
    const existingStore = await this.prisma.store.findUnique({
      where: { ownerId: createStoreDto.ownerId },
    });
    if (existingStore) {
      throw new ConflictException('This owner already has a store');
    }

    // Check email uniqueness
    const existingEmail = await this.prisma.store.findUnique({
      where: { email: createStoreDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Store email already exists');
    }

    return this.prisma.store.create({
      data: createStoreDto,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(query: QueryStoreDto, userId?: string) {
    const { search, name, email, address, sortBy, sortOrder, page = 1, limit = 10 } = query;

    const where: Prisma.StoreWhereInput = {};
    const conditions: Prisma.StoreWhereInput[] = [];

    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (name) conditions.push({ name: { contains: name, mode: 'insensitive' } });
    if (email) conditions.push({ email: { contains: email, mode: 'insensitive' } });
    if (address) conditions.push({ address: { contains: address, mode: 'insensitive' } });

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    const orderBy: Prisma.StoreOrderByWithRelationInput = {};
    if (sortBy && sortBy !== 'rating') {
      (orderBy as Record<string, string>)[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const skip = (page - 1) * limit;

    const [stores, total] = await Promise.all([
      this.prisma.store.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          ratings: { select: { rating: true, userId: true } },
          owner: { select: { id: true, name: true } },
        },
      }),
      this.prisma.store.count({ where }),
    ]);

    const storesWithRating = stores.map((store) => {
      const avgRating = store.ratings.length > 0
        ? parseFloat((store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(2))
        : 0;

      const userRating = userId
        ? store.ratings.find((r) => r.userId === userId)?.rating || null
        : null;

      const { ratings, ...storeData } = store;
      return {
        ...storeData,
        averageRating: avgRating,
        userRating,
        ratingCount: ratings.length,
      };
    });

    // Sort by rating if requested
    if (sortBy === 'rating') {
      storesWithRating.sort((a, b) =>
        sortOrder === 'desc' ? b.averageRating - a.averageRating : a.averageRating - b.averageRating,
      );
    }

    return {
      data: storesWithRating,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const avgRating = store.ratings.length > 0
      ? parseFloat((store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(2))
      : 0;

    return { ...store, averageRating: avgRating };
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (updateStoreDto.email && updateStoreDto.email !== store.email) {
      const existing = await this.prisma.store.findUnique({
        where: { email: updateStoreDto.email },
      });
      if (existing) {
        throw new ConflictException('Store email already exists');
      }
    }

    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async remove(id: string) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    await this.prisma.rating.deleteMany({ where: { storeId: id } });
    await this.prisma.store.delete({ where: { id } });

    return { message: 'Store deleted successfully' };
  }
}
