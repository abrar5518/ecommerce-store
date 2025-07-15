"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js router for programmatic navigation

const Searchbar: React.FC = () => {
  const [query, setQuery] = useState<string>(""); // Define the state as string for the search query
  const router = useRouter(); // Hook for navigating programmatically

  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (query) {
      // Redirect to the search results page with the query as a URL parameter
      router.push(`/search?query=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <label 
        htmlFor="default-search" 
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        {/* Icon for search */}
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg 
            className="w-4 h-4 text-gray-500 dark:text-gray-400" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 20 20"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        {/* Search input field */}
        <input
          type="search"
          id="default-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Handle input change
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-accent dark:bg-gray-700 dark:border-accent dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent dark:focus:border-accent"
          placeholder="Search Products, Categories ..."
          required
        />
        
        {/* Submit button */}
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-accent hover:bg-[#34c2ff] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-accent dark:hover:bg-accent dark:focus:ring-accent"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default Searchbar;
