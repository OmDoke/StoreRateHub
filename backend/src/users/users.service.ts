import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findAll(query: QueryUserDto) {
    const { search, name, email, address, role, sortBy, sortOrder, page = 1, limit = 10 } = query;

    const where: Prisma.UserWhereInput = {};
    const conditions: Prisma.UserWhereInput[] = [];

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
    if (role) conditions.push({ role });

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    const orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (sortBy) {
      (orderBy as Record<string, string>)[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        store: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: { rating: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate average rating if store owner
    let averageRating: number | null = null;
    if (user.store && user.store.ratings.length > 0) {
      const sum = user.store.ratings.reduce((acc, r) => acc + r.rating, 0);
      averageRating = parseFloat((sum / user.store.ratings.length).toFixed(2));
    }

    const { store, ...userData } = user;

    return {
      ...userData,
      ...(store ? { store: { id: store.id, name: store.name, averageRating } } : {}),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }

    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete related ratings first
    await this.prisma.rating.deleteMany({ where: { userId: id } });

    // If store owner, delete store and its ratings
    if (user.role === 'STORE_OWNER') {
      const store = await this.prisma.store.findUnique({ where: { ownerId: id } });
      if (store) {
        await this.prisma.rating.deleteMany({ where: { storeId: store.id } });
        await this.prisma.store.delete({ where: { id: store.id } });
      }
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
