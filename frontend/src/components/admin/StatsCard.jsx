import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatsCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-700">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-opacity-20 bg-gray-300">
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`mt-2 flex items-center text-sm ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
          <span className="ml-1">5% vs mois dernier</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;