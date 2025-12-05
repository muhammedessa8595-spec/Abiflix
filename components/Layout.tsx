import React from 'react';
import { Home, Search, MessageSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/admin/login';
  // Show App UI (Navbar/BottomBar) only when not on Landing or Login page
  const showAppUI = !isLandingPage && !isLoginPage;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Landing Page Header */}
      {isLandingPage && (
          <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-[1920px] mx-auto">
              <div className="text-abired font-black text-4xl md:text-5xl tracking-tighter cursor-pointer">
                  <span className="hidden md:inline">ABIFLIX</span>
                  <span className="md:hidden">AF</span>
              </div>
              <Link to="/browse" className="bg-abired text-white px-4 py-1.5 md:px-5 md:py-2 rounded font-medium hover:bg-red-700 transition text-sm md:text-base">
                  Sign In
              </Link>
          </header>
      )}

      {/* App Top Navbar - Only show inside App */}
      {showAppUI && (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 to-transparent px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/browse" className="flex items-center gap-1">
              <div className="text-abired font-black text-3xl tracking-tighter">AF</div>
              <div className="hidden md:block font-bold text-xl tracking-wide text-white">ABIFLIX</div>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
              <Link to="/browse" className={`hover:text-white transition ${isActive('/browse') ? 'text-white' : ''}`}>Home</Link>
              <Link to="/series" className={`hover:text-white transition ${isActive('/series') ? 'text-white' : ''}`}>Series</Link>
              <Link to="/movies" className={`hover:text-white transition ${isActive('/movies') ? 'text-white' : ''}`}>Movies</Link>
              <Link to="/latest" className="hover:text-white transition">New & Popular</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/search" className="text-white hover:text-abired transition"><Search size={24} /></Link>
            <Link to="/profile" className="hidden md:block">
              <div className="w-8 h-8 rounded bg-abired flex items-center justify-center text-sm font-bold">JD</div>
            </Link>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`flex-1 w-full ${showAppUI ? 'max-w-[2000px] mx-auto pb-16 md:pb-0' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation - Only show inside App */}
      {showAppUI && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-abidark border-t border-gray-800 flex justify-around items-center h-16 z-50 px-2">
          <Link to="/browse" className={`flex flex-col items-center gap-1 ${isActive('/browse') ? 'text-white' : 'text-gray-500'}`}>
            <Home size={20} />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link to="/search" className={`flex flex-col items-center gap-1 ${isActive('/search') ? 'text-white' : 'text-gray-500'}`}>
            <Search size={20} />
            <span className="text-[10px]">Search</span>
          </Link>
          <Link to="/ai" className={`flex flex-col items-center gap-1 ${isActive('/ai') ? 'text-abired' : 'text-gray-500'}`}>
            <MessageSquare size={20} />
            <span className="text-[10px]">AI Assistant</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-white' : 'text-gray-500'}`}>
            <User size={20} />
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      )}
    </div>
  );
};