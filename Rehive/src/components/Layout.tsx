import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useApp } from '../store/useApp';

export function Layout() {
  const { isAuthenticated } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {isAuthenticated && <Sidebar />}
      <main className={isAuthenticated ? 'pt-16' : ''}>
        <Outlet />
      </main>
    </div>
  );
}
