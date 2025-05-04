import { PrismaClient } from '../app/generated/prisma';
import {
  Prisma,
  Route,
  Stop,
  RouteStop,
  Quota_Policy,
  BusAssignment,
} from '../app/generated/prisma';

const prisma = new PrismaClient();

// Define model names
type ModelName = 'route' | 'stop' | 'routeStop' | 'quota_Policy' | 'busAssignment';

const modelConfig = {
  route: { delegate: prisma.route, keyField: 'routeId' },
  stop: { delegate: prisma.stop, keyField: 'stopId' },
  routeStop: { delegate: prisma.routeStop, keyField: 'routeStopId' },
  quota_Policy: { delegate: prisma.quota_Policy, keyField: 'quotaPolicyId' },
  busAssignment: { delegate: prisma.busAssignment, keyField: 'assignmentId' },
} as const;

export async function generateFormattedID<T extends ModelName>(
  modelName: T,
  prefix: string,
  padding = 4
): Promise<string> {
  const config = modelConfig[modelName];

  // Narrow delegate to concrete type
  const delegate = config.delegate as {
    findFirst: (args: {
      orderBy: Record<string, 'desc'>;
      select: Record<string, true>;
    }) => Promise<Record<string, string> | null>;
  };

  const keyField = config.keyField;

  const lastRecord = await delegate.findFirst({
    orderBy: {
      [keyField]: 'desc',
    },
    select: {
      [keyField]: true,
    },
  });

  let nextNumber = 1;

  const lastId = lastRecord?.[keyField];
  if (lastId) {
    const match = lastId.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1;
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(padding, '0')}`;
}
