'use client';

import React, { useEffect, useState } from 'react';
import styles from './bus-route-assignment.module.css';
import SearchBar from '@/components/ui/SearchBar';

interface BusRouteAssignment {
  BusRouteAssignmentID: string;
  BusAssignmentID: string;
  Route: {
    RouteName: string;
    StartStop: {
      StopName: string;
    };
    EndStop: {
      StopName: string;
    };
  };
  RegularBusAssignment: {
    BusAssignment: {
      BusID: string;
    };
  };
}

const BusRouteAssignmentPage: React.FC = () => {
  const [busRouteAssignments, setAssignments] = useState<BusRouteAssignment[]>([]);
  const [selectedBusAssignmentID, setSelectedBusAssignmentID] = useState<number | null>(null);
  const [selectedRouteID, setSelectedRouteID] = useState<string | null>(null);
  //const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/bus-route-assignment');
        if (!response.ok) {
          throw new Error(`Failed to fetch assignments: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched assignments:', data); // Debugging
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
  
    fetchAssignments();
  }, []);

  return (
    <div className="dashboard-content">
      <div className="center-box">
        <div className={styles.container}>
          {/* Tabs + Quota */}
          <div className={styles.tabRow}>
            <div className={styles.tabs}>
              <button className={styles.tab}>
                <img src="/assets/images/assignedbus.png" alt="Bus Icon" className={styles.tabIcon} />
                Assign Bus Driver/Conductor
              </button>
              <button className={`${styles.tab} ${styles.tabActive}`}>
                <img src="/assets/images/assignedroute.png" alt="Route Icon" className={styles.tabIcon} />
                Assign Bus to Route
              </button>
            </div>
            <button className={styles.tab}>
              <img src="/assets/images/philippine-peso.png" alt="Peso Icon" className={styles.tabIcon} />
              Quota Count
            </button>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.filterRow}>
              <label className={styles.filterLabel}>Filter</label>
              <select className={styles.select}>
                <option>Route</option>
              </select>
              <SearchBar></SearchBar>
            </div>

            {/* Form section */}
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <img src="/assets/images/assignedbus.png" alt="Bus Icon" className={styles.icon} />
                <p><strong>Selected Bus Assignment ID:</strong> {selectedBusAssignmentID ?? "None"}</p>
                <select
                  className={styles.selectBlack}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedBusAssignmentID(value === "" ? null : parseInt(value));
                  }}
                >
                  <option value="">-- Select Bus --</option>
                  {/* Replace these with your actual options */}
                  <option value="1">Bus 1</option>
                  <option value="2">Bus 2</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <img src="/assets/images/assignedroute.png" alt="Route Icon" className={styles.icon} />
                <p><strong>Selected Route ID:</strong> {selectedRouteID ?? "None"}</p>
                <select
                  className={styles.selectBlack}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedRouteID(value === "" ? null : value);
                  }}
                >
                  <option value="">-- Select Route --</option>
                  {/* Replace these with your actual options */}
                  <option value="route-1">Route A</option>
                  <option value="route-2">Route B</option>
                </select>
              </div>
            </div>


            {/* Action buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.clearButton}>CLEAR</button>
              <button className={styles.saveButton}>SAVE</button>
            </div>
          </div>

          {/* Table */}
          <div className={styles.dataTable}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th>Bus ID</th>
                  <th>Route Name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {busRouteAssignments.map((busRouteAssignments) => (
                  <tr key={busRouteAssignments.BusRouteAssignmentID} className={styles.tableRow}>
                    <td>{busRouteAssignments.RegularBusAssignment?.BusAssignment?.BusID}</td>
                    <td>{busRouteAssignments.Route?.RouteName}</td>
                    <td>{busRouteAssignments.Route?.StartStop?.StopName}</td>
                    <td>{busRouteAssignments.Route?.EndStop?.StopName}</td>
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
        </div>
      </div>
    </div>
  );
};

export default BusRouteAssignmentPage;
