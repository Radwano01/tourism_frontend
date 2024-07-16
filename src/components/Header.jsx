import React from 'react';
import { useUser } from '../components/UserContext';

export const Header = () => {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-gray-300">Back to Hero Page</a></li>
          {user ? (
            <>
              <li><a href="/profile" className="hover:text-gray-300">Profile</a></li>
              <li><button onClick={handleLogout} className="hover:text-gray-300">Logout</button></li>
            </>
          ) : (
            <>
              <li><a href="/register" className="hover:text-gray-300">Register</a></li>
              <li><a href="/login" className="hover:text-gray-300">Login</a></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};