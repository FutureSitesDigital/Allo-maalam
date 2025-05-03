import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

export default function Notification() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <BellIcon className="w-6 h-6 text-gray-700 hover:text-blue-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg p-4 z-10">
          <p className="text-gray-600">Aucune nouvelle demande</p>
          {/* Dakhl Notification kntdir demandes */}
        </div>
      )}
    </div>
  );
}
