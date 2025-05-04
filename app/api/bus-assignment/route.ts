import { NextResponse } from 'next/server';
import prisma from '@/client'; // Importing the Prisma client instance to interact with the database

export async function GET() {
  try {
    const assignments = await prisma.regularBusAssignment.findMany({
      include: {
        BusAssignment: {
          select: {
            BusID: true,
          },
        },
        quotaPolicy: {
          include: {
            Fixed: true,
            Percentage: true,
          },
        },
      },
    });
    console.log('Assignments from database:', assignments); // Debugging

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching bus route assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST request received'); // Debugging

    const data = await request.json();
    console.log('Data received in API:', data); // Debugging

    // Step 1: Query the latest BusAssignmentID
    console.log('Querying the latest BusAssignmentID...'); // Debugging
    const latestAssignment = await prisma.busAssignment.findFirst({
      orderBy: {
        BusAssignmentID: 'desc', // Sort by BusAssignmentID in descending order
      },
    });

    console.log('Latest BusAssignment:', latestAssignment); // Debugging

    // Step 2: Extract the numeric part and increment it
    let newIdNumber = 1; // Default to 1 if no records exist
    if (latestAssignment) {
      const latestId = latestAssignment.BusAssignmentID; // e.g., "BA-0001"
      console.log('Latest BusAssignmentID:', latestId); // Debugging

      const numericPart = parseInt(latestId.split('-')[1], 10); // Extract "0001" and convert to number
      console.log('Extracted numeric part:', numericPart); // Debugging

      newIdNumber = numericPart + 1; // Increment the number
      console.log('New numeric part:', newIdNumber); // Debugging
    }

    // Step 3: Format the new BusAssignmentID
    const newBusAssignmentID = `BA-${newIdNumber.toString().padStart(4, '0')}`; // e.g., "BA-0002"
    console.log('Generated new BusAssignmentID:', newBusAssignmentID); // Debugging

    // Step 4: Create the new BusAssignment record along with RegularBusAssignment
    console.log('Creating new BusAssignment record...'); // Debugging
    const newAssignment = await prisma.busAssignment.create({
      data: {
        BusAssignmentID: newBusAssignmentID,
        BusID: data.BusID,
        RouteID: data.RouteID,
        AssignmentDate: new Date(data.AssignmentDate),
        Battery: data.Battery,
        Lights: data.Lights,
        Oil: data.Oil,
        Water: data.Water,
        Break: data.Break,
        Air: data.Air,
        Gas: data.Gas,
        Engine: data.Engine,
        TireCondition: data.TireCondition,
        Self: data.Self,
        RegularBusAssignment: {
          create: {
            DriverID: data.DriverID,
            ConductorID: data.ConductorID,
            QuotaPolicyID: data.QuotaPolicyID, // Link to the correct Quota_Policy
            Change: data.Change,
            TripRevenue: data.TripRevenue,
          },
        },
      },
      include: {
        RegularBusAssignment: {
          include: {
            quotaPolicy: {
              include: {
                Fixed: true,
                Percentage: true,
              },
            },
          },
        },
      },
    });

    console.log('New BusAssignment created in database:', newAssignment); // Debugging
    return NextResponse.json(newAssignment);
  } catch (error) {
    console.error('Error creating BusAssignment:', error); // Debugging
    return NextResponse.json({ error: 'Failed to create BusAssignment' }, { status: 500 });
  }
}

// Code where route is passed to setSelectedRoute function
interface Route {
  route_id: string; // Ensure route_id is required
  routeName: string;
}

function handleRouteAssignment(route: Route) {
  // Ensuring that route contains the required property `route_id`
  if (!route.route_id) {
    console.error("Route is missing required 'route_id'");
    return;
  }

  // Now the route object can be safely passed to setSelectedRoute
  //setSelectedRoute(route); // store or use it as needed
  //setShowAssignRouteModal(false); // close modal
}

// Example usage:
const route = {
  route_id: "route-001", // Ensure this property exists
  routeName: "Route 1",
};

handleRouteAssignment(route);
