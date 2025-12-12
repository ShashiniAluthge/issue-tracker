
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaMariaDb({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root123",
    database: "issue-tracker",
});

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;