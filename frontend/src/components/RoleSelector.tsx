import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'associate' | 'manager') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Store Associate Card */}
      <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-white/30 hover:border-blue-400/50 group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden" onClick={() => onRoleSelect('associate')}>
        <CardHeader className="text-center pb-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
          {/* Animated Associate Illustration */}
          <div className="mx-auto mb-4 relative">
            <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto drop-shadow-lg">
              {/* Background Circle */}
              <circle cx="60" cy="60" r="55" fill="url(#associateGradient)" className="group-hover:fill-blue-200 transition-colors duration-300" />
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="associateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="100%" stopColor="#bfdbfe" />
                </linearGradient>
                <linearGradient id="associateAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              
              {/* Store Associate Figure */}
              <g className="animate-bounce" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}>
                {/* Body */}
                <rect x="45" y="55" width="30" height="40" rx="15" fill="url(#associateAccent)" />
                
                {/* Head */}
                <circle cx="60" cy="40" r="12" fill="#fbbf24" />
                
                {/* Arms */}
                <rect x="35" y="60" width="8" height="25" rx="4" fill="#fbbf24" className="animate-pulse" />
                <rect x="77" y="60" width="8" height="25" rx="4" fill="#fbbf24" />
                
                {/* Legs */}
                <rect x="48" y="90" width="8" height="20" rx="4" fill="#1f2937" />
                <rect x="64" y="90" width="8" height="20" rx="4" fill="#1f2937" />
              </g>
              
              {/* Handheld Scanner */}
              <g className="animate-pulse" style={{ animationDuration: '2s' }}>
                <rect x="25" y="65" width="12" height="8" rx="2" fill="#374151" />
                <rect x="27" y="67" width="8" height="4" rx="1" fill="#10b981" />
                {/* Scanner beam */}
                <line x1="37" y1="69" x2="45" y2="69" stroke="#ef4444" strokeWidth="2" className="animate-ping" />
              </g>
              
              {/* Floating Boxes (Products) */}
              <g className="animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <rect x="85" y="30" width="8" height="8" rx="1" fill="#f59e0b" opacity="0.8" />
                <rect x="85" y="45" width="8" height="8" rx="1" fill="#10b981" opacity="0.8" />
                <rect x="85" y="60" width="8" height="8" rx="1" fill="#8b5cf6" opacity="0.8" />
              </g>
              
              {/* Checkmark Animation */}
              <g className="animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
                <circle cx="90" cy="85" r="8" fill="#10b981" opacity="0.9" />
                <path d="M86 85 L89 88 L94 82" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
          
          <CardTitle className="text-xl text-blue-800 group-hover:text-blue-900 transition-colors font-bold">Store Associate</CardTitle>
          <CardDescription className="text-sm text-blue-700 font-semibold">
            Scan shelves, restock products, and manage inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white/95 backdrop-blur-sm">
          <Button className="w-full h-12 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200 group-hover:scale-105 flex items-center justify-center shadow-lg rounded-xl px-4 py-3" style={{ color: 'white' }}>
            <span className="text-center whitespace-nowrap leading-none text-white" style={{ color: 'white' }}>Continue as Associate</span>
          </Button>
        </CardContent>
      </Card>

      {/* Store Manager Card */}
      <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-white/30 hover:border-green-400/50 group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden" onClick={() => onRoleSelect('manager')}>
        <CardHeader className="text-center pb-4 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm">
          {/* Animated Manager Illustration */}
          <div className="mx-auto mb-4 relative">
            <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto drop-shadow-lg">
              {/* Background Circle */}
              <circle cx="60" cy="60" r="55" fill="url(#managerGradient)" className="group-hover:fill-green-200 transition-colors duration-300" />
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="managerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dcfce7" />
                  <stop offset="100%" stopColor="#bbf7d0" />
                </linearGradient>
                <linearGradient id="managerAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
              
              {/* Store Manager Figure */}
              <g className="animate-bounce" style={{ animationDuration: '3.5s', animationIterationCount: 'infinite' }}>
                {/* Body (Professional attire) */}
                <rect x="45" y="55" width="30" height="40" rx="15" fill="url(#managerAccent)" />
                
                {/* Head */}
                <circle cx="60" cy="40" r="12" fill="#fbbf24" />
                
                {/* Arms */}
                <rect x="35" y="60" width="8" height="25" rx="4" fill="#fbbf24" />
                <rect x="77" y="60" width="8" height="25" rx="4" fill="#fbbf24" className="animate-pulse" />
                
                {/* Legs */}
                <rect x="48" y="90" width="8" height="20" rx="4" fill="#1f2937" />
                <rect x="64" y="90" width="8" height="20" rx="4" fill="#1f2937" />
              </g>
              
              {/* Tablet/Clipboard */}
              <g className="animate-pulse" style={{ animationDuration: '2.5s' }}>
                <rect x="80" y="62" width="15" height="20" rx="2" fill="#374151" />
                <rect x="82" y="64" width="11" height="16" rx="1" fill="#3b82f6" />
                {/* Screen glow */}
                <rect x="82" y="64" width="11" height="16" rx="1" fill="#60a5fa" opacity="0.5" className="animate-ping" />
              </g>
              
              {/* Floating Analytics Icons */}
              <g className="animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
                {/* Chart bars */}
                <rect x="20" y="40" width="3" height="8" fill="#f59e0b" opacity="0.8" />
                <rect x="25" y="35" width="3" height="13" fill="#10b981" opacity="0.8" />
                <rect x="30" y="30" width="3" height="18" fill="#8b5cf6" opacity="0.8" />
              </g>
              
              {/* Floating Dollar Signs */}
              <g className="animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                <text x="25" y="75" fill="#059669" fontSize="12" fontWeight="bold" opacity="0.8">$</text>
                <text x="90" y="35" fill="#059669" fontSize="10" fontWeight="bold" opacity="0.6">$</text>
              </g>
              
              {/* Performance Indicator */}
              <g className="animate-pulse" style={{ animationDuration: '2s', animationDelay: '1.5s' }}>
                <circle cx="25" cy="85" r="6" fill="#059669" opacity="0.9" />
                <path d="M22 85 L24 87 L28 82" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
          
          <CardTitle className="text-xl text-green-800 group-hover:text-green-900 transition-colors font-bold">Store Manager</CardTitle>
          <CardDescription className="text-sm text-green-700 font-semibold">
            Monitor performance, analytics, and team oversight
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white/95 backdrop-blur-sm">
          <Button className="w-full h-12 text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-200 group-hover:scale-105 flex items-center justify-center shadow-lg rounded-xl px-4 py-3" style={{ color: 'white' }}>
            <span className="text-center whitespace-nowrap leading-none text-white" style={{ color: 'white' }}>Continue as Manager</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;