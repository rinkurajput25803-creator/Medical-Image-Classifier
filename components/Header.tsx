import React from 'react';

const StethoscopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1-2 0 8 8 0 0 1 16 0 1 1 0 0 1-2 0 6 6 0 0 0-12 0Z" />
    <path d="M10 13v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V13" />
    <path d="M12 13v7" />
    <path d="M9 20h6" />
    <circle cx="12" cy="5" r="2" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-surface shadow-md">
      <div className="container mx-auto p-4 flex items-center justify-center">
        <StethoscopeIcon className="text-primary mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
          Medical Image Classifier <span className="text-primary">POC</span>
        </h1>
      </div>
    </header>
  );
};