import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
    where: { email: 'john.storeowner@example.com' },
    update: {},
    create: {
      name: 'John Smith Store Owner',
      email: 'john.storeowner@example.com',
      password: ownerPassword,
      address: '456 Commerce Blvd, Business District, NY 10001',
      role: Role.STORE_OWNER,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'jane.storeowner@example.com' },
    update: {},
    create: {
      name: 'Jane Doe Store Owner Person',
      email: 'jane.storeowner@example.com',
      password: ownerPassword,
      address: '789 Market Street, Shopping Center, CA 90001',
      role: Role.STORE_OWNER,
    },
  });
  console.log('✅ Store owners created');

  // Create Normal Users
  const userPassword = await bcrypt.hash('User@1234', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'alice.johnson@example.com' },
    update: {},
    create: {
      name: 'Alice Johnson Regular User',
      email: 'alice.johnson@example.com',
      password: userPassword,
      address: '321 Residential Ave, Home Town, TX 73301',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob.williams@example.com' },
    update: {},
    create: {
      name: 'Robert Williams Regular User',
      email: 'bob.williams@example.com',
      password: userPassword,
      address: '654 Suburb Lane, Quiet Village, FL 33101',
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'charlie.brown@example.com' },
    update: {},
    create: {
      name: 'Charlie Brown Regular User',
      email: 'charlie.brown@example.com',
      password: userPassword,
      address: '987 Park Road, Green City, WA 98101',
      role: Role.USER,
    },
  });
  console.log('✅ Normal users created');

  // Create Stores
  const store1 = await prisma.store.upsert({
    where: { ownerId: owner1.id },
    update: {},
    create: {
      name: "John's Electronics Hub",
      email: 'electronics@store.com',
      address: '100 Tech Avenue, Silicon Valley, CA 94025',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { ownerId: owner2.id },
    update: {},
    create: {
      name: "Jane's Fashion Boutique",
      email: 'fashion@store.com',
      address: '200 Style Street, Fashion District, NY 10018',
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
  console.log('  Store Owner: john.storeowner@example.com / Owner@123');
  console.log('  Store Owner: jane.storeowner@example.com / Owner@123');
  console.log('  User:        alice.johnson@example.com / User@1234');
  console.log('  User:        bob.williams@example.com / User@1234');
  console.log('  User:        charlie.brown@example.com / User@1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
