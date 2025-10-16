import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ShelfMindLogo from './ShelfMindLogo';

interface HeaderProps {
  onGetStartedClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStartedClick }) => {
  const location = useLocation();

  const handleGetStartedClick = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    } else if (location.pathname === '/') {
      // On homepage, trigger the modal via URL parameter
      window.location.href = '/?action=register';
    } else {
      // Default behavior - navigate to register page
      window.location.href = '/register';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo and Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <ShelfMindLogo size="sm" />
              <span className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                ShelfMind
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#solutions"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Solutions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a
              href="#technology"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Technology
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a
              href="#resources"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Right Side - Get Started Button */}
          <div className="flex items-center">
            <Button
              onClick={handleGetStartedClick}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu (Hidden by default, can be expanded later) */}
        <div className="md:hidden border-t border-slate-200 py-3 hidden">
          <nav className="flex flex-col space-y-3">
            <a
              href="#solutions"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 px-2 py-1"
            >
              Solutions
            </a>
            <a
              href="#technology"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 px-2 py-1"
            >
              Technology
            </a>
            <a
              href="#resources"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 px-2 py-1"
            >
              Resources
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;