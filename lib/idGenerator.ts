import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

// Union of model names we support
type ModelName = 'route' | 'stop' | 'routeStop' | 'quota_Policy' | 'busAssignment';

// Type mapping each model name to its Prisma delegate and key field
const modelConfig = {
  route: { delegate: prisma.route, keyField: 'routeId' },
  stop: { delegate: prisma.stop, keyField: 'stopId' },
  routeStop: { delegate: prisma.routeStop, keyField: 'routeStopId' },
  quota_Policy: { delegate: prisma.quota_Policy, keyField: 'quotaPolicyId' },
  busAssignment: { delegate: prisma.busAssignment, keyField: 'assignmentId' },
} as const;

// Infer delegate type
type ModelDelegate<T extends ModelName> = typeof modelConfig[T]['delegate'];

/**
 * Generates a custom-formatted ID like "ROUTE-0001" by querying the highest existing value.
 *
 * @param modelName - The Prisma model name
 * @param prefix - The prefix string (e.g., "ROUTE")
 * @param padding - Number of digits to pad (default is 4)
 * @returns The next generated ID string
 */
export async function generateFormattedID<T extends ModelName>(
  modelName: T,
  prefix: string,
  padding: number = 4
): Promise<string> {
  const { delegate, keyField } = modelConfig[modelName] as {
    delegate: { findFirst: Function },
    keyField: string
  };

  const lastRecord = await delegate.findFirst({
    orderBy: {
      [keyField]: 'desc',
    },
    select: {
      [keyField]: true,
    },
  });

  let nextNumber = 1;

  if (lastRecord && typeof lastRecord[keyField] === 'string') {
    const match = lastRecord[keyField].match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1;
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(padding, '0')}`;
}
