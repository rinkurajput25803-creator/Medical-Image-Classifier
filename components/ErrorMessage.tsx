import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-500/20 border-l-4 border-red-500 text-red-300 p-4 rounded-md mb-6" role="alert">
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
  );
};