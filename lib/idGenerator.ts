import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

// Generic model interface with a typed findFirst method
interface ModelWithFindFirst {
  findFirst<T extends object>(args: {
    orderBy: Record<string, 'asc' | 'desc'>;
    select: Record<string, boolean>;
  }): Promise<T | null>;
}

// Mapping of model names to actual Prisma model instances
const modelMap: Record<string, ModelWithFindFirst> = {
  quota_Policy: prisma.quota_Policy,
  stop: prisma.stop,
  route: prisma.route,
  routeStop: prisma.routeStop,
  busAssignment: prisma.busAssignment,
};

type PrismaModelName = keyof typeof modelMap;

/**
 * Generate a formatted ID with a prefix and padded number based on the last existing ID in a given Prisma model.
 *
 * @param modelName - The name of the Prisma model to query
 * @param field - The field in the model to sort by (e.g., 'routeId')
 * @param prefix - The prefix to include in the generated ID (e.g., 'ROUTE')
 * @param padding - The number of digits to pad the ID number (default: 4)
 * @returns A formatted ID string like 'ROUTE-0001'
 */
export async function generateFormattedID(
  modelName: PrismaModelName,
  field: string,
  prefix: string,
  padding: number = 4
): Promise<string> {
  const model = modelMap[modelName];

  const lastRecord = await model.findFirst<{ [key: string]: string | null }>({
    orderBy: {
      [field]: 'desc',
    },
    select: {
      [field]: true,
    },
  });

  let nextNumber = 1;

  if (lastRecord && typeof lastRecord[field] === 'string') {
    const match = lastRecord[field]!.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1;
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(padding, '0')}`;
}
