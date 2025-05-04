'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import DropdownButton from '../ui/DropdownButton';
import { fetchBuses } from '../../lib/fetchBuses';

interface Bus {
  busId: string;
  route: string;
  type: string;
  capacity: number;
  image: string | null;
}

// ← ADDED: Props interface replacing inline `any`
interface AssignBusModalProps {
  onClose: () => void;
  onAssign: (bus: Bus) => void;      // ← CHANGED: bus typed as `Bus`
}

const AssignBusModal: React.FC<AssignBusModalProps> = ({
  onClose,
  onAssign,
}) => {

  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    const loadBuses = async () => {
      try {
        const data = await fetchBuses();
        setBuses(data);
        setFilteredBuses(data); 
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };
  
    loadBuses();
  }, []);

  const [filteredBuses, setFilteredBuses] = useState(buses);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownItems = [
    {
      name: 'All',
      action: () => {
        setFilteredBuses(buses);
      },
    },
    {
      name: 'Alphabetical',
      action: () => {
        const sorted = [...filteredBuses].sort((a, b) => a.busId.localeCompare(b.busId));
        setFilteredBuses(sorted);
      },
    },
    {
      name: 'Aircon',
      action: () => {
        const airconOnly = buses.filter(bus => bus.type === 'Aircon');
        setFilteredBuses(airconOnly);
      },
    },
    {
      name: 'Non-Aircon',
      action: () => {
        const nonAirconOnly = buses.filter(bus => bus.type === 'Non-Aircon');
        setFilteredBuses(nonAirconOnly);
      },
    },

    {
      name: 'All',
      action: () => {
        setFilteredBuses(buses);
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
      <main className="w-[720px] h-[600px] rounded-lg bg-white shadow-xl p-4 flex flex-col border border-gray-300">
        {/* Search Bar */}
        <header className="mb-4">
          <SearchBar
            placeholder="Search Bus"
            value={searchTerm}
            onChange={(e) => {
              const text = e.target.value;
              setSearchTerm(text);
              const filtered = buses.filter((bus) =>
                bus.busId.toLowerCase().includes(text.toLowerCase()) ||
                bus.route.toLowerCase().includes(text.toLowerCase()) ||
                bus.type.toLowerCase().includes(text.toLowerCase())
              );
              setFilteredBuses(filtered);
            }}
          />
        </header>

        {/* Title and Filter section */}
        <nav className="px-3 flex justify-between items-center mb-2">
          <div className="font-medium text-lg">Available Buses</div>
          <div className="flex items-center">
            <div className="font-medium mr-3">Filter</div>
            <DropdownButton dropdownItems={dropdownItems} />
          </div>
        </nav>

        {/* Bus List Section */}
        <section className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 mb-4">
          {filteredBuses.map((bus, index) => (
            <article
              key={index}
              className="rounded-lg my-1 px-3 flex items-center h-20 bg-gray-50 hover:bg-gray-100 cursor-pointer text-black justify-between"
            >
              <div className="flex items-center gap-3">
                {/* Bus Icon */}
                <div className="bg-gray-200 rounded-2xl h-20 w-20 flex items-center relative overflow-hidden">
                  <Image
                    src={bus.image || '/assets/images/bus-fallback.png'}
                    alt="Bus"
                    className="object-cover"
                    fill
                  />
                </div>
                {/* Bus Details */}
                <div className='flex flex-col items-start'>
                  <div className="flex gap-2 items-center">
                    <div>{bus.busId}</div>
                    <div className="text-sm text-gray-400">{bus.route}</div>
                  </div>
                  <div className="text-sm text-gray-400">{bus.type}</div>
                  <div className="text-sm text-gray-400">{`${bus.capacity} seats`}</div>
                </div>
              </div>
              {/* Assign Button */}
              <Button 
                text="Assign"
                onClick={() => onAssign(bus)}
              />
              
            </article>
          ))}
        </section>

        {/* Cancel button */}
        <footer className="flex justify-end">
          <Button
            onClick={onClose}
            text="Cancel"
            bgColor="bg-gray-200"
            textColor="text-gray-700"
          />
        </footer>
      </main>
    </div>
  );
};

export default AssignBusModal;
