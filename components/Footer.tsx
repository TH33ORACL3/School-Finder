import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-brand-800 to-brand-900 border-t-2 border-brand-700 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-brand-200 text-sm">
              School Search - schoolsearch.co.za
            </p>
            <p className="text-brand-300 text-xs mt-1">
              Helping families find the right educational environment
            </p>
            <p className="text-brand-400 text-xs mt-1">
              📅 Local data updated: October 25, 2025
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-white font-semibold">
              Created by AZ Labs
            </p>
            <p className="text-brand-300 text-xs mt-1">
              Version 0.0.5
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
