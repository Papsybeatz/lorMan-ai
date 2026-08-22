import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

let client;

export function getPrisma() {
	if (!client) {
		const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
		client = new PrismaClient({ adapter });
	}
	return client;
}