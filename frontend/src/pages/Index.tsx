
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ShelfMindLogo from '@/components/ShelfMindLogo';
import { ArrowRight, Eye, BarChart3, Zap, Shield, Users, TrendingUp, EyeOff, Mail, Lock, User, Building, MapPin, X, Smartphone, Camera, Bot } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { loginUser, registerUser, LoginRequest, RegisterRequest } from '@/utils/api';

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

const Index = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'associate' | 'manager' | ''>('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    storeId: '',
    storeName: ''
  });
  const [registerRole, setRegisterRole] = useState<'associate' | 'manager' | ''>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const isAuth = localStorage.getItem('shelfmind_auth');
    const userData = localStorage.getItem('shelfmind_user');
    
    if (isAuth && userData) {
      const user = JSON.parse(userData);
      // Navigate based on user role
      if (user.role === 'associate') {
        navigate('/associate');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/login');
      }
    } else {
      // Show content instead of immediately redirecting
      setShowContent(true);
      
      // Check if we should show registration modal (e.g., from header "Get Started" click)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'register') {
        setShowAuthModal(true);
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [navigate]);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword || !loginRole) {
      showError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const loginData: LoginRequest = {
        email: loginEmail,
        password: loginPassword,
        role: loginRole
      };

      const response = await loginUser(loginData);
      
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
      
      // Set logged in state to show store info briefly
      setIsLoggedIn(true);
      
      showSuccess(`Welcome ${response.user.name}!`);
      
      // Navigate based on role after a brief delay to show store info
      setTimeout(() => {
        if (loginRole === 'associate') {
          navigate('/associate');
        } else {
          navigate('/manager');
        }
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      showError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    
    if (!validateForm() || !registerRole) {
      return;
    }

    setIsLoading(true);
    
    try {
      const registerData: RegisterRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: registerRole,
        store_id: formData.storeId,
        store_name: formData.storeName
      };

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
      if (registerRole === 'associate') {
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

  const handleCloseAuth = () => {
    setShowAuthModal(false);
    setAuthView('signin'); // Reset to default view
    setLoginEmail('');
    setLoginPassword('');
    setLoginRole('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      storeId: '',
      storeName: ''
    });
    setRegisterRole('');
    setErrors({});
  };

  const switchToSignUp = () => {
    setAuthView('signup');
    // Clear any existing errors when switching views
    setErrors({});
  };

  const switchToSignIn = () => {
    setAuthView('signin');
    // Clear any existing errors when switching views
    setErrors({});
  };

  if (!showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading ShelfMind...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-50 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-slate-100/50"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-slate-200/40 rounded-full blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
                  Revolutionizing Retail Through{' '}
                  <span className="text-blue-600">AI-Driven Data</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
                  Transform your retail operations with intelligent shelf monitoring technology.
                  Our AI-powered platform delivers real-time insights, reduces stockouts, and
                  maximizes revenue potential through advanced computer vision and analytics.
                </p>
                <p className="text-base md:text-lg text-blue-700 font-semibold mt-4">
                  The AI-powered solution for retail execution, designed for businesses.
                </p>
              </div>

            </div>

            {/* Right Column - Professional Graphic */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Main container with clean, corporate design */}
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-blue-700">Live Monitoring</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Shelf Analytics Dashboard</h3>
                  </div>

                  {/* Shelf visualization */}
                  <div className="space-y-6">
                    {/* Shelf A - Optimal */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-slate-700">Shelf A1</span>
                        </div>
                        <div className="text-xs text-green-700 font-bold bg-green-100 px-2 py-1 rounded-full">Optimal</div>
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="h-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm"></div>
                        ))}
                      </div>
                    </div>

                    {/* Shelf B - Medium */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-slate-700">Shelf B2</span>
                        </div>
                        <div className="text-xs text-amber-700 font-bold bg-amber-100 px-2 py-1 rounded-full">Medium</div>
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-6 bg-gradient-to-t from-green-500 to-green-400 rounded-sm"></div>
                        ))}
                        {[...Array(3)].map((_, i) => (
                          <div key={i + 5} className="h-6 bg-slate-200 rounded-sm border border-dashed border-slate-300"></div>
                        ))}
                      </div>
                    </div>

                    {/* Shelf C - Critical */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-semibold text-slate-700">Shelf C3</span>
                        </div>
                        <div className="text-xs text-red-700 font-bold bg-red-100 px-2 py-1 rounded-full">Critical</div>
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="h-6 bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm"></div>
                        ))}
                        {[...Array(6)].map((_, i) => (
                          <div key={i + 2} className="h-6 bg-slate-200 rounded-sm border border-dashed border-slate-300"></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Analytics indicators */}
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-xs font-semibold text-slate-600">AI Vision</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-xs font-semibold text-slate-600">Analytics</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Zap className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="text-xs font-semibold text-slate-600">Alerts</div>
                    </div>
                  </div>
                </div>

                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-slate-200/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Solutions Section */}
      <div className="bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              Our Product Solutions
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our comprehensive suite of AI-powered retail monitoring solutions,
              designed to fit your store's unique needs and infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Mobile Scan Solution */}
            <div className="group">
              <Card className="h-full border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-slate-50">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                    Mobile Scan
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Empower your staff with mobile scanning capabilities for real-time shelf monitoring and inventory management.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Instant product recognition</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Real-time inventory updates</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Easy staff adoption</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Cost-effective deployment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fixed Camera Solution */}
            <div className="group">
              <Card className="h-full border-2 border-slate-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-slate-50">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                    Fixed Camera in the Aisle
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Strategic camera placement for continuous monitoring and automated alerts when shelves need attention.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">24/7 automated monitoring</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Intelligent alert system</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Comprehensive coverage</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Minimal staff intervention</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Robot Scan Solution */}
            <div className="group">
              <Card className="h-full border-2 border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-slate-50">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                    Robot Scan
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Autonomous robotic systems that patrol your store, providing comprehensive shelf monitoring and analytics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Autonomous navigation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Advanced AI analytics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Complete store coverage</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">Predictive insights</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseAuth}
                  className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-200/50"
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {authView === 'signin' ? 'Welcome Back' : 'Join ShelfMind'}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  {authView === 'signin' ? 'Sign in to your account' : 'Create your new account'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {authView === 'signin' ? (
                  /* Sign In Form */
                  <div className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-gray-700 font-medium">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 bg-white/90 backdrop-blur-sm rounded-lg"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-gray-700 font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-password"
                            type={showLoginPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 bg-white/90 backdrop-blur-sm rounded-lg"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
                          >
                            {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-role" className="text-gray-700 font-medium">Role</Label>
                        <Select value={loginRole} onValueChange={(value: 'associate' | 'manager') => {
                          setLoginRole(value);
                          // Pre-fill demo credentials based on role
                          if (value === 'associate') {
                            setLoginEmail('associate@demo.com');
                            setLoginPassword('demo123');
                          } else {
                            setLoginEmail('manager@demo.com');
                            setLoginPassword('demo456');
                          }
                        }}>
                          <SelectTrigger className="h-11 bg-white/90 backdrop-blur-sm rounded-lg">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="associate">Store Associate</SelectItem>
                            <SelectItem value="manager">Store Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 font-semibold shadow-lg rounded-lg transition-all duration-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>

                    {/* Demo Credentials */}
                    <Card className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border border-blue-200/50 shadow-sm rounded-lg">
                      <CardContent className="pt-3 pb-3">
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-xs text-blue-700 font-semibold">Demo Mode Active</p>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                          <p className="text-xs text-blue-600">Select a role to auto-fill demo credentials</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Switch to Sign Up */}
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={switchToSignUp}
                          className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                          disabled={isLoading}
                        >
                          Create one
                        </button>
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Sign Up Form */
                  <div className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-3">
                      {/* Name Field */}
                      <div className="space-y-1">
                        <Label htmlFor="register-name" className="text-gray-700 font-medium">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 bg-white/90 backdrop-blur-sm rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                          />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-1">
                        <Label htmlFor="register-email" className="text-gray-700 font-medium">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 bg-white/90 backdrop-blur-sm rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-1">
                        <Label htmlFor="register-password" className="text-gray-700 font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={`pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 bg-white/90 backdrop-blur-sm rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                        <p className="text-xs text-gray-500">Must be at least 6 characters with letters and numbers</p>
                      </div>

                      {/* Confirm Password Field */}
                      <div className="space-y-1">
                        <Label htmlFor="register-confirm-password" className="text-gray-700 font-medium">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className={`pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 bg-white/90 backdrop-blur-sm rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                      </div>

                      {/* Role Field */}
                      <div className="space-y-1">
                        <Label htmlFor="register-role" className="text-gray-700 font-medium">Role</Label>
                        <Select value={registerRole} onValueChange={(value: 'associate' | 'manager') => setRegisterRole(value)}>
                          <SelectTrigger className="h-10 bg-white/90 backdrop-blur-sm rounded-lg">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="associate">Store Associate</SelectItem>
                            <SelectItem value="manager">Store Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Store ID Field */}
                      <div className="space-y-1">
                        <Label htmlFor="register-store-id" className="text-gray-700 font-medium">Store ID</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-store-id"
                            type="text"
                            placeholder="Enter store ID (e.g., store-001)"
                            value={formData.storeId}
                            onChange={(e) => handleInputChange('storeId', e.target.value)}
                            className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 bg-white/90 backdrop-blur-sm rounded-lg ${errors.storeId ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                          />
                        </div>
                        {errors.storeId && <p className="text-red-500 text-xs">{errors.storeId}</p>}
                      </div>

                      {/* Store Name Field */}
                      <div className="space-y-1">
                        <Label htmlFor="register-store-name" className="text-gray-700 font-medium">Store Name</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-store-name"
                            type="text"
                            placeholder="Enter store name"
                            value={formData.storeName}
                            onChange={(e) => handleInputChange('storeName', e.target.value)}
                            className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 bg-white/90 backdrop-blur-sm rounded-lg ${errors.storeName ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                          />
                        </div>
                        {errors.storeName && <p className="text-red-500 text-xs">{errors.storeName}</p>}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-10 font-semibold shadow-lg rounded-lg transition-all duration-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>

                    {/* Switch to Sign In */}
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={switchToSignIn}
                          className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                          disabled={isLoading}
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;