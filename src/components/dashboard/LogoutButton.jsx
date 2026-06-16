'use client';

import axios from 'axios';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
      window.location.href = '/login'; // Fallback redirect anyway
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full py-2.5 rounded-xl bg-danger/5 border border-danger/15 text-danger font-bold text-xs hover:bg-danger/10 transition-all duration-300 active:scale-[0.98]"
    >
      Sign Out
    </button>
  );
}
