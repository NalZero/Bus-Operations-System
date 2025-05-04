// import { NextResponse } from 'next/server';
// import prisma from '@/client'; // Importing the Prisma client instance to interact with the database

// export async function GET() {
//   try {
//     const assignments = await prisma.busRouteAssignment.findMany({
//       include: {
//         Route: {
//           select: {
//             RouteName: true,
//             StartStop: {
//               select: {
//                 StopName: true,
//               }
//             },
//             EndStop: {
//               select: {
//                 StopName: true,
//               }
//             },
//           }
//         },
//         RegularBusAssignment: {
//           select: {
//             BusAssignment: {
//               select: {
//                 BusID: true,
//               }
//             }
//           }
//         }
//       }

//     });
//     console.log('Assignments from database:', assignments); // Debugging

//     // Dummy JSON data for testing only
//     // const assignments = [
//     //   { busrouteassignmentid: 1, busassignmentid: 101, routeid: 201 },
//     //   { busrouteassignmentid: 2, busassignmentid: 102, routeid: 202 },
//     //   { busrouteassignmentid: 3, busassignmentid: 103, routeid: 203 },
//     // ];

//     return NextResponse.json(assignments);
//   } catch (error) {
//     console.error('Error fetching bus route assignments:', error);
//     return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
//   }
// }
