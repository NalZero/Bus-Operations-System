import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

// Define allowed model names
type ModelName = 'route' | 'stop' | 'routeStop' | 'quota_Policy' | 'busAssignment';

// Define mapping for each model's delegate and ID field name
const modelConfig = {
  route: { delegate: prisma.route, keyField: 'routeId' },
  stop: { delegate: prisma.stop, keyField: 'stopId' },
  routeStop: { delegate: prisma.routeStop, keyField: 'routeStopId' },
  quota_Policy: { delegate: prisma.quota_Policy, keyField: 'quotaPolicyId' },
  busAssignment: { delegate: prisma.busAssignment, keyField: 'assignmentId' },
} as const;

/**
 * Generates a formatted ID like "STOP-0001" for a given model.
 * @param modelName - The name of the model
 * @param prefix - The prefix to use in the ID
 * @param padding - Number of digits to pad (default 4)
 * @returns A new ID string
 */
export async function generateFormattedID<T extends ModelName>(
  modelName: T,
  prefix: string,
  padding = 4
): Promise<string> {
  const { delegate, keyField } = modelConfig[modelName];

  // Use dynamic key selection while keeping strict typing
  const lastRecord = await delegate.findFirst({
    orderBy: {
      [keyField]: 'desc',
    },
    select: {
      [keyField]: true,
    },
  }) as { [K in typeof keyField]?: string } | null;

  let nextNumber = 1;

  if (lastRecord?.[keyField]) {
    const match = lastRecord[keyField]!.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1;
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(padding, '0')}`;
}
