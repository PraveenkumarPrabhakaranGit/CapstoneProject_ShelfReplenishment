import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, Building, MapPin } from 'lucide-react';
import ShelfMindLogo from '@/components/ShelfMindLogo';
import RoleSelector from '@/components/RoleSelector';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { registerUser, RegisterRequest } from '@/utils/api';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  storeId: string;
  storeName: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  storeId?: string;
  storeName?: string;
}

const Register = () => {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<'associate' | 'manager' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    storeId: '',
    storeName: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'associate' | 'manager') => {
    setSelectedRole(role);
    setStep('form');
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one digit';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Store ID validation
    if (!formData.storeId) {
      newErrors.storeId = 'Store ID is required';
    }

    // Store name validation
    if (!formData.storeName) {
      newErrors.storeName = 'Store name is required';
    } else if (formData.storeName.length < 2) {
      newErrors.storeName = 'Store name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[DEBUG] Register.tsx - Form submission started');
    console.log('[DEBUG] Register.tsx - Selected role:', selectedRole);
    console.log('[DEBUG] Register.tsx - Form data:', formData);
    
    if (!validateForm() || !selectedRole) {
      console.log('[DEBUG] Register.tsx - Validation failed or no role selected');
      return;
    }

    setIsLoading(true);
    
    try {
      const registerData: RegisterRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: selectedRole,
        store_id: formData.storeId,
        store_name: formData.storeName
      };

      console.log('[DEBUG] Register.tsx - Prepared registration data:', registerData);
      const response = await registerUser(registerData);
      
      // Store authentication data
      localStorage.setItem('shelfmind_auth', 'true');
      localStorage.setItem('shelfmind_user', JSON.stringify({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        storeId: response.user.store_id,
        storeName: response.user.store_name
      }));
      localStorage.setItem('shelfmind_token', response.access_token);
      
      showSuccess(`Welcome ${response.user.name}! Your account has been created successfully.`);
      
      // Navigate based on role
      if (selectedRole === 'associate') {
        navigate('/associate');
      } else {
        navigate('/manager');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      storeId: '',
      storeName: ''
    });
    setErrors({});
  };

  const handleLoginRedirect = () => {
    navigate('/login');
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
              <p className="text-sm text-blue-200 drop-shadow">Join our smart retail management platform</p>
            </div>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {step === 'role' ? 'Choose Your Role' : 'Create Your Account'}
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                {step === 'role' 
                  ? 'Select your role to get started with ShelfMind' 
                  : `Register as a ${selectedRole === 'associate' ? 'Store Associate' : 'Store Manager'}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {step === 'role' ? (
                <RoleSelector onRoleSelect={handleRoleSelect} />
              ) : (
                <>
                  <form onSubmit={handleRegister} className="space-y-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`pl-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-14 bg-white/90 backdrop-blur-sm rounded-xl text-base ${errors.name ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`pl-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-14 bg-white/90 backdrop-blur-sm rounded-xl text-base ${errors.email ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`pl-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-14 bg-white/90 backdrop-blur-sm rounded-xl text-base ${errors.password ? 'border-red-500' : ''}`}
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
                      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                      <p className="text-xs text-gray-500">Must be at least 6 characters with letters and numbers</p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`pl-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-14 bg-white/90 backdrop-blur-sm rounded-xl text-base ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    </div>

                    {/* Store ID Field */}
                    <div className="space-y-2">
                      <Label htmlFor="storeId" className="text-gray-700 font-semibold">Store ID</Label>
                      <div className="relative">
                        <Building className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="storeId"
                          type="text"
                          placeholder="Enter store ID (e.g., store-001)"
                          value={formData.storeId}
                          onChange={(e) => handleInputChange('storeId', e.target.value)}
                          className={`pl-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-14 bg-white/90 backdrop-blur-sm rounded-xl text-base ${errors.storeId ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.storeId && <p className="text-red-500 text-sm">{errors.storeId}</p>}
                    </div>

                    {/* Store Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="storeName" className="text-gray-700 font-semibold">Store Name</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="storeName"
                          type="text"
                          placeholder="Enter store name"
                          value={formData.storeName}
                          onChange={(e) => handleInputChange('storeName', e.target.value)}
                          className={`pl-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-14 bg-white/90 backdrop-blur-sm rounded-xl text-base ${errors.storeName ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.storeName && <p className="text-red-500 text-sm">{errors.storeName}</p>}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-14 text-lg font-bold shadow-xl rounded-xl transition-all duration-200 transform hover:scale-[1.02]" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        'Create Account'
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

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-12 text-sm font-semibold border-2 border-gray-300 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 rounded-xl transition-all duration-200" 
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      Change Role
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12 text-sm font-semibold border-2 border-gray-300 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 rounded-xl transition-all duration-200" 
                      onClick={handleLoginRedirect}
                      disabled={isLoading}
                    >
                      Sign In Instead
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Store Info Footer */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Secure Registration</span>
              </div>
              <div className="w-1 h-4 bg-white/30"></div>
              <span>ShelfMind Platform</span>
              <div className="w-1 h-4 bg-white/30"></div>
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;