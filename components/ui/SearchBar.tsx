'use client';
import React from 'react';
import Image from 'next/image';

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


const SearchBar = ({placeholder='Search',className='', value = '', onChange} :SearchBarProps) => {
  return (
    <div className={`${className} relative`}>
      {/* Search Bar */}
      <input
        type="text"
        value={value} // ✅ this line makes `value` used
        className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        onChange={onChange}
      />

      {/* Search Icon */}
      <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
        <Image
          src="/icons/search-icon.svg" 
          alt="Search"
          width={16}
          height={16}
        />
      </div>
    </div>
  );
};

export default SearchBar;
