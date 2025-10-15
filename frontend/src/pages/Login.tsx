import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import ShelfMindLogo from '@/components/ShelfMindLogo';
import RoleSelector from '@/components/RoleSelector';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';

const Login = () => {
  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [selectedRole, setSelectedRole] = useState<'associate' | 'manager' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'associate' | 'manager') => {
    setSelectedRole(role);
    setStep('credentials');
    
    // Pre-fill demo credentials based on role
    if (role === 'associate') {
      setEmail('alex@shelfmind.com');
      setPassword('associate123');
    } else {
      setEmail('maria@shelfmind.com');
      setPassword('manager123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !selectedRole) {
      showError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user: User = {
        id: selectedRole === 'associate' ? 'alex-001' : 'maria-001',
        email,
        name: selectedRole === 'associate' ? 'Alex Rodriguez' : 'Maria Chen',
        role: selectedRole,
        storeId: 'store-001',
        storeName: 'Metro Fresh Market'
      };
      
      localStorage.setItem('shelfmind_auth', 'true');
      localStorage.setItem('shelfmind_user', JSON.stringify(user));
      
      showSuccess(`Welcome ${user.name}!`);
      setIsLoading(false);
      
      // Navigate based on role
      if (selectedRole === 'associate') {
        navigate('/associate');
      } else {
        navigate('/manager');
      }
    }, 1500);
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&crop=center')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-purple-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Branding */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
                <ShelfMindLogo size="lg" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">ShelfMind</h1>
              <p className="text-lg text-blue-100 font-medium drop-shadow">AI-Powered Shelf Monitoring</p>
              <p className="text-sm text-blue-200 drop-shadow">Smart retail management for modern stores</p>
            </div>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {step === 'role' ? 'Choose Your Role' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                {step === 'role' 
                  ? 'Select your role to access the appropriate dashboard' 
                  : 'Sign in to continue to your dashboard'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {step === 'role' ? (
                <RoleSelector onRoleSelect={handleRoleSelect} />
              ) : (
                <>
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-14 bg-white/90 backdrop-blur-sm rounded-xl text-base"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-14 bg-white/90 backdrop-blur-sm rounded-xl text-base"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-14 text-lg font-bold shadow-xl rounded-xl transition-all duration-200 transform hover:scale-[1.02]" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-white px-4 text-gray-500 font-semibold tracking-wide">Or</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-14 text-base font-semibold border-2 border-gray-300 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    Change Role
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-white px-4 text-gray-500 font-semibold tracking-wide">New User?</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-14 text-base font-semibold border-2 border-blue-300 bg-blue-50/90 backdrop-blur-sm hover:bg-blue-100/90 text-blue-700 hover:text-blue-800 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={() => navigate('/register')}
                    disabled={isLoading}
                  >
                    Create an Account
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Demo Credentials - Enhanced */}
          {step === 'credentials' && (
            <Card className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-2xl">
              <CardContent className="pt-6 pb-6">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-blue-700 font-bold">Demo Mode Active</p>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs text-blue-600">Credentials are pre-filled • Ready to explore ShelfMind!</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Store Info Footer */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Metro Fresh Market</span>
              </div>
              <div className="w-1 h-4 bg-white/30"></div>
              <span>Store #001</span>
              <div className="w-1 h-4 bg-white/30"></div>
              <span>Downtown Location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;