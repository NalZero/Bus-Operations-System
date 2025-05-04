'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import DropdownButton from '../ui/DropdownButton';

interface Route {
  routeID: string;
  routeName: string;
  isActive: boolean;
  startPoint: string;
  endPoint: string;
  roundTrip: boolean;
  noOfBus: number;
  image: string | null;
}

const AssignRouteModal = ({ 
  onClose,
  onAssign, 
}: { 
  onClose: () => void;
  onAssign: (route: Route) => void; 
 }) => {

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch('/api/routes');
        const data = await res.json();
        setRoutes(data); 
        setFilteredRoutes(data);
      } catch (err) {
        console.error("Failed to fetch routes:", err);
      }
    };
  
    fetchRoutes();
  }, []);
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState(routes); // use state for filter function
  const [searchTerm, setSearchTerm] = useState(''); // use state for search function

  const dropdownItems = [
    {
      name: 'Alphabetical',
      action: () => {
        const sorted = [...filteredRoutes].sort((a, b) => a.routeName.localeCompare(b.routeName));
        setFilteredRoutes(sorted);
      },
    },

    {
      name: 'Round Trip Only',
      action: () => {
        const filtered = routes.filter(route => route.roundTrip === true);
        setFilteredRoutes(filtered);
      },
    },
    {
      name: 'One-Way Only',
      action: () => {
        const filtered = routes.filter(route => route.roundTrip === false);
        setFilteredRoutes(filtered);
      },
    },
    {
      name: 'Show All',
      action: () => {
        setFilteredRoutes(routes);
      },
    }
   
  ];
  
  return (
    // Modal
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
      <main className="w-[720px] h-[600px] rounded-lg bg-white shadow-lg p-4 flex flex-col">
        {/*  Search Bar */}
        <header className='mb-4'>  
          <SearchBar 
            placeholder='Search Route' 
            value={searchTerm}
            onChange={(e) => {
              const text = e.target.value;
              setSearchTerm(text);
          
              // Filter buses
              const filtered = routes.filter((route) =>
                route.routeName.toLowerCase().includes(text.toLowerCase()) ||
                route.startPoint.toLowerCase().includes(text.toLowerCase()) ||
                route.endPoint.toLowerCase().includes(text.toLowerCase())
              );
              setFilteredRoutes(filtered);
            }}
          ></SearchBar>
        </header>

        {/* Title and Filter section */}
        <nav className='px-3 flex justify-between items-center mb-2'>
          <div className='font-medium text-lg'>Routes</div>
          {/* Filter */}
          <div className='flex items-center'>
            <div className='font-medium mr-3'>Filter</div>
            <DropdownButton dropdownItems={dropdownItems}></DropdownButton>
          </div>
        </nav>

        {/* Bus List Section */}
        <section className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 mb-4">
          {filteredRoutes.map((route, index) => (
            // Each Bus
            <article key={index} className="rounded-lg my-1 px-3 flex items-center h-20 bg-gray-50 hover:bg-gray-100 cursor-pointer text-black justify-between">
              {/* Bus Info */}
              <div className="flex items-center gap-3">
                {/* Bus Icon */}
                <div className="bg-gray-200 rounded-2xl h-20 w-20 flex items-center relative overflow-hidden">
                  <Image
                    src={route.image || '/assets/images/bus-fallback.png'}
                    alt="Bus"
                    className="object-cover"
                    fill
                  />
                </div>
                {/* Bus Details */}
                <div className='flex flex-col items-start'>
                  <div className="flex gap-2 items-center">
                    <div>{route.routeName}</div>
                    <div className="text-sm text-gray-400">{route.roundTrip? 'Round Trip': 'One-way Trip'}</div>
                  </div>
                  <div className="text-sm text-gray-400">{`${route.noOfBus} buses`}</div>
                  <div className="text-sm text-gray-400">{route.isActive? 'Active': 'Inactive'}</div>
                </div>
              </div>

              {/* Assign Button */}
              <Button
                text='Assign'
                onClick = {() => onAssign(route)}

              ></Button>
                    
            </article>
          ))}
        </section>

        {/* Cancel button */}
        <footer className='flex justify-end'>
          <Button onClick={onClose} text='Cancel' bgColor='bg-gray-200' textColor='text-gray-700'></Button>
        </footer>

      </main>
    </div>
    

  );
};

export default AssignRouteModal;
