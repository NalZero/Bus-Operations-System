import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

// Define model names as a union type
type PrismaModelName = 'quota_Policy' | 'stop' | 'route' | 'routeStop' | 'busAssignment';

// Typed map of model names to Prisma client delegates
const modelMap = {
  quota_Policy: prisma.quota_Policy,
  stop: prisma.stop,
  route: prisma.route,
  routeStop: prisma.routeStop,
  busAssignment: prisma.busAssignment,
} as const;

// Type helper to extract the correct model delegate
type ModelMap = typeof modelMap;
type ModelDelegate<T extends keyof ModelMap> = ModelMap[T];

/**
 * Generate a formatted ID with a prefix and padded number based on the last existing ID in a given Prisma model.
 *
 * @param modelName - The name of the Prisma model to query
 * @param field - The field in the model to sort by (e.g., 'routeId')
 * @param prefix - The prefix to include in the generated ID (e.g., 'ROUTE')
 * @param padding - The number of digits to pad the ID number (default: 4)
 * @returns A formatted ID string like 'ROUTE-0001'
 */
export async function generateFormattedID<T extends PrismaModelName>(
  modelName: T,
  field: string,
  prefix: string,
  padding: number = 4
): Promise<string> {
  const model: ModelDelegate<T> = modelMap[modelName];

  const lastRecord = await model.findFirst({
    orderBy: {
      [field]: 'desc',
    },
    select: {
      [field]: true,
    },
  });

  let nextNumber = 1;

  if (lastRecord && typeof lastRecord[field as keyof typeof lastRecord] === 'string') {
    const match = (lastRecord[field as keyof typeof lastRecord] as string).match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1;
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(padding, '0')}`;
}
