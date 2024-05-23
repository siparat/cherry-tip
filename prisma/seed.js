const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('fs');
const { join } = require('path');

const prisma = new PrismaClient();

const getTags = () => {
	return JSON.parse(readFileSync(join(__dirname, 'seed-data.json'), 'utf-8'))
}

const run = async () => {
	const tags = getTags()
	await prisma.$connect();

	for (const category of tags.categories) {
		await prisma.categoryModel.upsert({
			where: { id: category.id },
			create: category,
			update: {}
		});
	}
	for (const diet of tags.diets) {
		await prisma.dietTypeModel.upsert({
			where: { id: diet.id },
			create: diet,
			update: {}
		});
	}
	for (const preparation of tags.preparations) {
		await prisma.preparationModel.upsert({
			where: { id: preparation.id },
			create: preparation,
			update: {}
		});
	}
};

run()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
