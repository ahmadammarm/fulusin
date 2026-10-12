import { PrismaClient } from '../../src/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const prismaClientSingleton = () => {
    const connectionString = `${process.env.DATABASE_URL}`;

    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "warn", "error"]
                : ["warn", "error"],
        errorFormat: "pretty",
    });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = (globalThis as unknown as { prismaGlobal?: ReturnType<typeof prismaClientSingleton> }).prismaGlobal ?? prismaClientSingleton();


export default prisma;

if (process.env.NODE_ENV !== 'production') {
    (globalThis as unknown as { prismaGlobal?: ReturnType<typeof prismaClientSingleton> }).prismaGlobal = prisma;
}