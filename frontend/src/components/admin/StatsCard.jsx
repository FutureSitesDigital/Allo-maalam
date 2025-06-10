import React from 'react';

const StatsCard = ({ title, count, icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className={`p-6 rounded-lg shadow-sm ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{count}</h3>
        </div>
        <div className="p-3 rounded-full bg-white bg-opacity-50">
          {React.cloneElement(icon, { className: "h-8 w-8" })}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;