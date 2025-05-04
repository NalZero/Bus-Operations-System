'use client';

import React, { useEffect, useState } from 'react';
import AssignBusModal from '@/components/modal/AssignBusModal';
import AssignDriverModal from '@/components/modal/AssignDriverModal';
import AssignConductorModal from '@/components/modal/AssignConductorModal';
import AssignRouteModal from '@/components/modal/AssignRouteModal';
//import Button from "@/components/ui/Button";
import styles from './bus-assignment.module.css';

interface RegularBusAssignment {
  RegularBusAssignmentID: string;
  DriverID: string;
  ConductorID: string;
  BusAssignment?: {
    BusID: string;
  } | null;
  quotaPolicy?: {
    Fixed?: {
      Quota: string;
    } | null;
    Percentage?: {
      Quota: string;
    } | null;
  } | null;
}

interface Bus {
  busId: string;
  route: string;
  type: string;
  capacity: number;
  image: string | null;
}

interface Driver {
  driver_id: string;
  name: string;
  job: string;
  contactNo: string;
  address: string;
  image: string | null; 
}

interface Conductor {
  conductor_id: string;
  name: string;
  job: string;
  contactNo: string;
  address: string;
  image: string | null;
}

interface Route {
  routeID: string;
  routeName: string;
}


const BusAssignmentPage: React.FC = () => {

  // Flags for modal
  const [busAssignments, setAssignments] = useState<RegularBusAssignment[]>([]);
  const [showAssignBusModal, setShowAssignBusModal] = useState(false);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [showAssignConductorModal, setShowAssignConductorModal] = useState(false);
  const [showAssignRouteModal, setShowAssignRouteModal] = useState(false);


  // current record
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedConductor, setSelectedConductor] = useState<Conductor | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);


  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/bus-assignment');
        if (!response.ok) {
          throw new Error(`Failed to fetch assignments: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched assignments:', data);
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  const handleClear = () => {
    // Clear logic for resetting form values or handling state
    setSelectedBus(null);
    setSelectedDriver(null);
    setSelectedConductor(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    // Gather the data to send to the API
    const data = {
      RouteID: 'RT-0001', // Replace with the selected route ID
      BusID: selectedBus?.busId || '', // Use the selected bus ID
      AssignmentDate: new Date().toISOString(), // Use the current date or a selected date
      Battery: true, // Replace with actual form values
      Lights: true,
      Oil: true,
      Water: true,
      Break: true,
      Air: true,
      Gas: true,
      Engine: true,
      TireCondition: true,
      Self: true,
      DriverID: selectedDriver?.driver_id || '',
      ConductorID: selectedConductor?.conductor_id || '',
      QuotaPolicyID: 'QTA-0001', // Replace with the actual QuotaPolicyID
      Change: 0.0,
      TripRevenue: 1000.0,
    };
    
    console.log('Data to be sent to API:', data); // Debugging

    try {
      // Send a POST request to the API route
      const response = await fetch('/api/bus-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create BusAssignment');
      }
  
      const result = await response.json();
      console.log('New BusAssignment created:', result);
  
      // Optionally, reset the form or update the UI
      handleClear();
      alert('BusAssignment created successfully!');
    } catch (error) {
      console.error('Error creating BusAssignment:', error);
      alert('Failed to create BusAssignment');
    }
  };

  return (


    <div className="dashboard-content">
      <div className="center-box">
        <div className={styles.container}>

          {/* Title */}
          <h2 className={styles.assignmentTitle}>CREATE ASSIGNMENT</h2>

          {/* Assignment Boxes */}
          <div className={styles.topPart}>
            {/* Bus Box */}
            <div className={styles.topItem}>
              <div className={styles.assignmentBox}>
                <div className={styles.tab}>
                  <img src="/assets/images/assignedbus.png" alt="Bus Icon" className={styles.tabIcon} />
                  Bus
                </div>
                <button className={styles.saveButton} onClick={() => setShowAssignBusModal(true)}>
                  + Assign Bus
                </button>
                {/* <input type="text" value={selectedBus.busId} placeholder="Bus ID" /> */}
                <div className={styles.outputField}>
                  {selectedBus ? selectedBus.busId : 'None Selected'}
                </div>
              </div>
            </div>

            {/* Driver Box */}
            <div className={styles.topItem}>
              <div className={styles.assignmentBox}>
                <div className={styles.tab}>
                  <img src="/assets/images/bus-driver.png" alt="Driver Icon" className={styles.tabIcon} />
                  Driver
                </div>
                <button className={styles.saveButton} onClick={() => setShowAssignDriverModal(true)}>
                  + Assign Driver
                </button>
                {/* <input type="text" placeholder="Name" /> */}
                <div className={styles.outputField}>
                  {selectedDriver ? selectedDriver.name : 'None Selected'}
                </div>
              </div>
            </div>

            {/* Conductor Box */}
            <div className={styles.topItem}>
              <div className={styles.assignmentBox}>
                <div className={styles.tab}>
                  <img src="/assets/images/bus-conductor.png" alt="Conductor Icon" className={styles.tabIcon} />
                  Conductor
                </div>
                <button className={styles.saveButton} onClick={() => setShowAssignConductorModal(true)}>
                  + Assign Conductor
                </button>
                {/* <input type="text" placeholder="Name" /> */}
                <div className={styles.outputField}>
                  {selectedConductor ? selectedConductor.name : 'None Selected'}
                </div>
              </div>
            </div>
          </div>

            {/* Bottom Row: Route + Quota + Buttons */}
            <div className={styles.bottomRow}>
              {/* Route Box */}
              <div className={styles.topItem}>
                <div className={styles.assignmentBox}>
                  <div className={styles.tab}>
                    <img src="/assets/images/assignedroute.png" alt="Route Icon" className={styles.tabIcon} />
                    Route
                  </div>
                  <button className={styles.saveButton} onClick={() => setShowAssignRouteModal(true)}>
                    + Assign Route
                  </button>
                  {/* <input type="text" placeholder="Route Name" /> */}
                  <div className={styles.outputField}>
                    {selectedRoute ? selectedRoute.routeName : 'None Selected'}
                  </div>
                </div>
              </div>

              {/* Quota Box */}
              <div className={styles.topItem}>
                <div className={styles.assignmentBox}>
                  <div className={styles.tab}>
                    <img src="/assets/images/philippine-peso.png" alt="Quota Icon" className={styles.tabIcon} />
                    Quota
                  </div>
                  <select className={styles.selectInput}>
                    <option value="">Select Quota Type</option>
                    <option value="daily">Fixed</option>
                    <option value="weekly">Percentage</option>
                  </select>
                  <input type="text" placeholder="Value" />
                </div>
              </div>

              {/* Buttons */}
              <div className={styles.buttonColumn}>
                <button className={styles.clearButton} onClick={handleClear}>Clear</button>
                <button type="submit" className={styles.addButton} onClick={handleAdd}>Add</button>
              </div>
            </div>


          {/* Table Part */}
          <div className={styles.dataTable}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th>Assignment</th>
                  <th>Bus ID</th>
                  <th>Driver</th>
                  <th>Conductor</th>
                  <th>Route</th>
                  <th>Quota</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {busAssignments.map((assignment) => (
                  <tr key={assignment.RegularBusAssignmentID} className={styles.tableRow}>
                    <td>{assignment.RegularBusAssignmentID}</td>
                    <td>{assignment.BusAssignment?.BusID}</td>
                    <td>{assignment.DriverID}</td>
                    <td>{assignment.ConductorID}</td>
                    <td>no route yet</td>
                    <td>
                      {assignment.quotaPolicy?.Fixed
                        ? `Fixed: ${assignment.quotaPolicy.Fixed.Quota}`
                        : assignment.quotaPolicy?.Percentage
                        ? `Percentage: ${assignment.quotaPolicy.Percentage.Quota}`
                        : 'No Quota'}
                    </td>
                    <td className={styles.actions}>
                      <button className={styles.editBtn}>
                        <img src="/assets/images/edit.png" alt="Edit" />
                      </button>
                      <button className={styles.deleteBtn}>
                        <img src="/assets/images/delete.png" alt="Delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modals */}
          {showAssignBusModal && (
            <AssignBusModal 
              onClose={() => setShowAssignBusModal(false) } 
              onAssign={(bus) => {
                alert(`Assigned Bus: ${bus.busId}`);
                setSelectedBus(bus); // store or use it as needed
                setShowAssignBusModal(false); // close modal
              }}
            />
          )}
          {showAssignDriverModal && (
            <AssignDriverModal 
              onClose={() => setShowAssignDriverModal(false)} 
              onAssign={(driver) => {
                alert(`Assigned Driver: ${driver.name}`);
                setSelectedDriver(driver); // store or use it as needed
                setShowAssignDriverModal(false); // close modal
              }}
            />
          )}
          {showAssignConductorModal && (
            <AssignConductorModal 
              onClose={() => setShowAssignConductorModal(false)}
              onAssign={(conductor) => {
                alert(`Assigned Conductor: ${conductor.name}`);
                setSelectedConductor(conductor); // store or use it as needed
                setShowAssignConductorModal(false); // close modal
              }} 
            />
          )}
          {showAssignRouteModal && (
            <AssignRouteModal 
              onClose={() => setShowAssignRouteModal(false)}
              onAssign={(route) => {
                alert(`Assigned Route: ${route.routeName}`);
                setSelectedRoute(route); // store or use it as needed
                setShowAssignRouteModal(false); // close modal
              }} 
            />
          )}
          

        </div>
      </div>
    </div>
  );
};

export default BusAssignmentPage;
