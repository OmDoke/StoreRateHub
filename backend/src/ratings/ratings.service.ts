import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createRatingDto: CreateRatingDto) {
    // Check store exists
    const store = await this.prisma.store.findUnique({
      where: { id: createRatingDto.storeId },
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check if user already rated this store
    const existingRating = await this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId: createRatingDto.storeId,
        },
      },
    });
    if (existingRating) {
      throw new ConflictException('You have already rated this store. Use update instead.');
    }

    return this.prisma.rating.create({
      data: {
        rating: createRatingDto.rating,
        userId,
        storeId: createRatingDto.storeId,
      },
      include: {
        store: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, userId: string, updateRatingDto: UpdateRatingDto) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
    });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    if (rating.userId !== userId) {
      throw new ForbiddenException('You can only update your own ratings');
    }

    return this.prisma.rating.update({
      where: { id },
      data: { rating: updateRatingDto.rating },
      include: {
        store: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }

  async findByStore(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const ratings = await this.prisma.rating.findMany({
      where: { storeId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating = ratings.length > 0
      ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2))
      : 0;

    return {
      store: { id: store.id, name: store.name },
      averageRating: avgRating,
      totalRatings: ratings.length,
      ratings,
    };
  }
}
