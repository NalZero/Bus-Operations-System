import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

type ModelName = 'route' | 'stop' | 'routeStop' | 'quota_Policy' | 'busAssignment';

/**
 * Generate a formatted ID with a prefix and padded number based on the last existing ID.
 */
export async function generateFormattedID(
  modelName: ModelName,
  field: string,
  prefix: string,
  padding = 4
): Promise<string> {
  // Holder for the last record response
  let lastIdValue: string | undefined;

  switch (modelName) {
    case 'route': {
      const rec = await prisma.route.findFirst({
        orderBy: { [field]: 'desc' },
        select: { [field]: true },
      });
      lastIdValue = rec?.[field] as string | undefined;
      break;
    }
    case 'stop': {
      const rec = await prisma.stop.findFirst({
        orderBy: { [field]: 'desc' },
        select: { [field]: true },
      });
      lastIdValue = rec?.[field] as string | undefined;
      break;
    }
    case 'routeStop': {
      const rec = await prisma.routeStop.findFirst({
        orderBy: { [field]: 'desc' },
        select: { [field]: true },
      });
      lastIdValue = rec?.[field] as string | undefined;
      break;
    }
    case 'quota_Policy': {
      const rec = await prisma.quota_Policy.findFirst({
        orderBy: { [field]: 'desc' },
        select: { [field]: true },
      });
      lastIdValue = rec?.[field] as string | undefined;
      break;
    }
    case 'busAssignment': {
      const rec = await prisma.busAssignment.findFirst({
        orderBy: { [field]: 'desc' },
        select: { [field]: true },
      });
      lastIdValue = rec?.[field] as string | undefined;
      break;
    }
    default:
      throw new Error(`Unsupported model: ${modelName}`);
  }

  // Compute next number
  let nextNumber = 1;
  if (lastIdValue) {
    const match = lastIdValue.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1;
    }
  }

  // Format and return new ID
  return `${prefix}-${nextNumber.toString().padStart(padding, '0')}`;
}
