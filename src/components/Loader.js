import React from 'react';

const Loader = () => (
  <div className="flex justify-center items-center h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white-900"></div>
  </div>
);

export default Loader;