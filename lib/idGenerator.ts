import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

// Define the types for model instances with the findFirst method
interface ModelWithFindFirst {
  findFirst(args: {
    orderBy: Record<string, 'asc' | 'desc'>;
    select: Record<string, boolean>;
  }): Promise<any | null>; // Changed to 'any' to support more complex return types
}

// Mapping of model names to actual Prisma model instances, with the correct types
const modelMap: Record<string, ModelWithFindFirst> = {
  quota_Policy: prisma.quota_Policy,
  stop: prisma.stop,
  route: prisma.route,
  routeStop: prisma.routeStop,
  busAssignment: prisma.busAssignment,
};

// Define the valid keys for the above map
type PrismaModelName = keyof typeof modelMap;

// Define the expected structure of findFirst's return for record fields
type RecordWithField = {
  [key: string]: string;
};

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
  // Safely access the model from the map
  const model = modelMap[modelName];

  // Use findFirst to get the last record and determine the next ID number
  const lastRecord = await model.findFirst({
    orderBy: {
      [field]: 'desc', // Order by the field in descending order
    },
    select: {
      [field]: true, // Only select the field we're interested in
    },
  });

  let nextNumber = 1;

  // If a last record exists, extract the next number
  if (lastRecord && typeof lastRecord[field] === 'string') {
    const match = lastRecord[field].match(/\d+$/); // Match the digits at the end of the ID
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1; // Increment the number
    }
  }

  // Return the formatted ID with prefix and padded number
  return `${prefix}-${nextNumber.toString().padStart(padding, '0')}`;
}
