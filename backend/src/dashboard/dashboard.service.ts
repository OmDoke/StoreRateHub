import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.store.count(),
      this.prisma.rating.count(),
    ]);

    // Ratings distribution (1-5)
    const ratingsDistribution = await Promise.all(
      [1, 2, 3, 4, 5].map(async (value) => ({
        rating: value,
        count: await this.prisma.rating.count({ where: { rating: value } }),
      })),
    );

    // Users by role
    const usersByRole = await Promise.all(
      ['ADMIN', 'USER', 'STORE_OWNER'].map(async (role) => ({
        role,
        count: await this.prisma.user.count({ where: { role: role as any } }),
      })),
    );

    return {
      totalUsers,
      totalStores,
      totalRatings,
      ratingsDistribution,
      usersByRole,
    };
  }

  async getStoreOwnerDashboard(userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store) {
      return { store: null, averageRating: 0, ratings: [] };
    }

    const avgRating = store.ratings.length > 0
      ? parseFloat((store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(2))
      : 0;

    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      averageRating: avgRating,
      totalRatings: store.ratings.length,
      ratings: store.ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        userName: r.user.name,
        userEmail: r.user.email,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
    };
  }
}
