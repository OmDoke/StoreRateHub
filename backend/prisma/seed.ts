import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@storeratehub.com' },
    update: {},
    create: {
      name: 'System Administrator User',
      email: 'admin@storeratehub.com',
      password: adminPassword,
      address: '123 Admin Street, Admin City, Admin State 12345',
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create Store Owners
  const ownerPassword = await bcrypt.hash('Owner@123', 10);
  const owner1 = await prisma.user.upsert({
    where: { email: 'arjun.storeowner@example.com' },
    update: {},
    create: {
      name: 'Arjun Mehta Store Owner',
      email: 'arjun.storeowner@example.com',
      password: ownerPassword,
      address: '12 MG Road, Connaught Place, New Delhi 110001',
      role: Role.STORE_OWNER,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'priya.storeowner@example.com' },
    update: {},
    create: {
      name: 'Priya Nair Store Owner Person',
      email: 'priya.storeowner@example.com',
      password: ownerPassword,
      address: '45 Linking Road, Bandra West, Mumbai 400050',
      role: Role.STORE_OWNER,
    },
  });
  console.log('✅ Store owners created');

  // Create Normal Users
  const userPassword = await bcrypt.hash('User@1234', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'rahul.sharma@example.com' },
    update: {},
    create: {
      name: 'Rahul Sharma Regular User',
      email: 'rahul.sharma@example.com',
      password: userPassword,
      address: '78 Koramangala, Bengaluru, Karnataka 560034',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'sneha.patel@example.com' },
    update: {},
    create: {
      name: 'Sneha Patel Regular User',
      email: 'sneha.patel@example.com',
      password: userPassword,
      address: '23 CG Road, Navrangpura, Ahmedabad, Gujarat 380009',
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'amit.verma@example.com' },
    update: {},
    create: {
      name: 'Amit Verma Regular User',
      email: 'amit.verma@example.com',
      password: userPassword,
      address: '56 Anna Salai, Teynampet, Chennai, Tamil Nadu 600018',
      role: Role.USER,
    },
  });
  console.log('✅ Normal users created');

  // Create Stores
  const store1 = await prisma.store.upsert({
    where: { ownerId: owner1.id },
    update: {},
    create: {
      name: "Arjun's Electronics Hub",
      email: 'electronics@store.com',
      address: '15 Nehru Place, New Delhi 110019',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { ownerId: owner2.id },
    update: {},
    create: {
      name: "Priya's Fashion Boutique",
      email: 'fashion@store.com',
      address: '88 Hill Road, Bandra West, Mumbai 400050',
      ownerId: owner2.id,
    },
  });
  console.log('✅ Stores created');

  // Create Ratings
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store1.id } },
    update: {},
    create: { rating: 5, userId: user1.id, storeId: store1.id },
  });
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store1.id } },
    update: {},
    create: { rating: 4, userId: user2.id, storeId: store1.id },
  });
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user3.id, storeId: store1.id } },
    update: {},
    create: { rating: 3, userId: user3.id, storeId: store1.id },
  });
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store2.id } },
    update: {},
    create: { rating: 4, userId: user1.id, storeId: store2.id },
  });
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store2.id } },
    update: {},
    create: { rating: 5, userId: user2.id, storeId: store2.id },
  });
  console.log('✅ Ratings created');

  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('📋 Login Credentials:');
  console.log('  Admin:       admin@storeratehub.com / Admin@123');
  console.log('  Store Owner: arjun.storeowner@example.com / Owner@123');
  console.log('  Store Owner: priya.storeowner@example.com / Owner@123');
  console.log('  User:        rahul.sharma@example.com / User@1234');
  console.log('  User:        sneha.patel@example.com / User@1234');
  console.log('  User:        amit.verma@example.com / User@1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
