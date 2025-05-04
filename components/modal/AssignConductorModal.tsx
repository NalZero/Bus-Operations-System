'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import DropdownButton from '../ui/DropdownButton';
import { fetchConductors } from '../../lib/fetchConductors';

interface Conductor {
  conductor_id: string;
  name: string;
  job: string;
  contactNo: string;
  address: string;
  image: string | null;
}

interface AssignConductorModalProps {
  onClose: () => void;
  onAssign: (conductor: Conductor) => void;
}

const AssignConductorModal: React.FC<AssignConductorModalProps> = ({ 
  onClose,
  onAssign, 
}) => {

  const [conductors, setConductors] = useState<Conductor[]>([]);

  useEffect(() => {
    const loadConductors = async () => {
      try {
        const data = await fetchConductors();
        setConductors(data);
        setFilteredConductors(data);
      } catch (error) {
        console.error('Error fetching conductors:', error);
      }
    };

    loadConductors();
  }, []);

  const [filteredConductors, setFilteredConductors] = useState(conductors);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownItems = [
    {
      name: 'Alphabetical',
      action: () => {
        const sorted = [...filteredConductors].sort((a, b) => a.name.localeCompare(b.name));
        setFilteredConductors(sorted);
      },
    },
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
      <main className="w-[720px] h-[600px] rounded-lg bg-white shadow-xl p-4 flex flex-col border border-gray-300">
        {/* Search Bar */}
        <header className="mb-4">
          <SearchBar
            placeholder="Search Conductor"
            value={searchTerm}
            onChange={(e) => {
              const text = e.target.value;
              setSearchTerm(text);

              const filtered = conductors.filter((conductor) =>
                conductor.name.toLowerCase().includes(text.toLowerCase()) ||
                conductor.job.toLowerCase().includes(text.toLowerCase()) ||
                conductor.contactNo.toLowerCase().includes(text.toLowerCase()) ||
                conductor.address.toLowerCase().includes(text.toLowerCase())
              );
              setFilteredConductors(filtered);
            }}
          />
        </header>

        {/* Title and Filter */}
        <nav className="px-3 flex justify-between items-center mb-2">
          <div className="font-medium text-lg">Available Conductors</div>
          <div className="flex items-center">
            <div className="font-medium mr-3">Filter</div>
            <DropdownButton dropdownItems={dropdownItems} />
          </div>
        </nav>

        {/* Conductor List */}
        <section className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 mb-4">
          {filteredConductors.map((conductor, index) => (
            <article
              key={index}
              className="rounded-lg my-1 px-3 flex items-center h-20 bg-gray-50 hover:bg-gray-100 cursor-pointer text-black justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-2xl h-20 w-20 flex items-center relative overflow-hidden">
                  <Image
                    src={conductor.image || '/assets/images/bus-fallback.png'}
                    alt="Conductor"
                    className="object-cover"
                    fill
                  />
                </div>
                <div className='flex flex-col items-start'>
                  <div className="flex gap-2 items-center">
                    <div>{conductor.name}</div>
                    <div className="text-sm text-gray-400">{conductor.job}</div>
                  </div>
                  <div className="text-sm text-gray-400">{conductor.contactNo}</div>
                  <div className="text-sm text-gray-400">{conductor.address}</div>
                </div>
              </div>
              <Button text="Assign" 
              onClick={() => onAssign(conductor)}/>
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

export default AssignConductorModal;
