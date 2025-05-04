import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

// Define the allowed model names
type ModelName = 'route' | 'stop' | 'routeStop' | 'quota_Policy' | 'busAssignment';

// Map each model name to its corresponding delegate and key field
const modelConfig = {
  route: { delegate: prisma.route, keyField: 'routeId' },
  stop: { delegate: prisma.stop, keyField: 'stopId' },
  routeStop: { delegate: prisma.routeStop, keyField: 'routeStopId' },
  quota_Policy: { delegate: prisma.quota_Policy, keyField: 'quotaPolicyId' },
  busAssignment: { delegate: prisma.busAssignment, keyField: 'assignmentId' },
} as const;

// Type-safe delegate inference
type ModelConfig = typeof modelConfig;
type DelegateType<T extends ModelName> = ModelConfig[T]['delegate'];
type KeyField<T extends ModelName> = ModelConfig[T]['keyField'];

/**
 * Generate a formatted ID like "STOP-0001" for a given model.
 * @param modelName - The name of the model
 * @param prefix - The prefix to use in the ID
 * @param padding - Number of digits to pad (default 4)
 * @returns A new ID string
 */
export async function generateFormattedID<T extends ModelName>(
  modelName: T,
  prefix: string,
  padding: number = 4
): Promise<string> {
  const { delegate, keyField } = modelConfig[modelName];

  // Use generic typing to ensure delegate supports `findFirst`
  const lastRecord = await delegate.findFirst({
    orderBy: {
      [keyField]: 'desc',
    },
    select: {
      [keyField]: true,
    },
  } as any); // We use `as any` here **only once** due to lack of unified typing across models

  let nextNumber = 1;

  if (lastRecord && typeof lastRecord[keyField] === 'string') {
    const match = lastRecord[keyField].match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1;
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(padding, '0')}`;
}
