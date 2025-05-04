import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

// Mapping of model names to actual Prisma model instances
const modelMap = {
  quota_Policy: prisma.quota_Policy,
  stop: prisma.stop,
  route: prisma.route,
  routeStop: prisma.routeStop,
  busAssignment: prisma.busAssignment,
} as const

type PrismaModelName = keyof typeof modelMap

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
  const model = modelMap[modelName]

  // Let TypeScript infer the result type; we expect the field to be a string
  const lastRecord = await model.findFirst({
    orderBy: {
      [field]: 'desc',
    },
    select: {
      [field]: true,
    },
  }) as Record<string, string> | null

  let nextNumber = 1

  if (lastRecord && typeof lastRecord[field] === 'string') {
    const match = lastRecord[field]!.match(/\d+$/)
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(padding, '0')}`
}
