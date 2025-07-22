import { PrismaClient } from "@prisma/client";

let prisma:PrismaClient;

if (!(global as any)._prisma) {
  (global as any)._prisma = new PrismaClient();
}

prisma = (global as any)._prisma;

export default prisma;