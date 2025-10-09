import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, Package, Eye, RefreshCw, LogOut, User } from 'lucide-react';
import ShelfMindLogo from '@/components/ShelfMindLogo';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  currentStock: number;
  maxCapacity: number;
  category: string;
  lastRestocked: string;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'low' | 'critical' | 'out';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Coffee Beans',
      currentStock: 45,
      maxCapacity: 50,
      category: 'Beverages',
      lastRestocked: '2 hours ago',
      trend: 'down',
      status: 'healthy'
    },
    {
      id: '2',
      name: 'Organic Milk',
      currentStock: 8,
      maxCapacity: 40,
      category: 'Dairy',
      lastRestocked: '1 day ago',
      trend: 'down',
      status: 'low'
    },
    {
      id: '3',
      name: 'Whole Wheat Bread',
      currentStock: 0,
      maxCapacity: 25,
      category: 'Bakery',
      lastRestocked: '3 days ago',
      trend: 'down',
      status: 'out'
    },
    {
      id: '4',
      name: 'Fresh Apples',
      currentStock: 2,
      maxCapacity: 30,
      category: 'Produce',
      lastRestocked: '6 hours ago',
      trend: 'down',
      status: 'critical'
    },
    {
      id: '5',
      name: 'Chocolate Bars',
      currentStock: 28,
      maxCapacity: 35,
      category: 'Snacks',
      lastRestocked: '1 hour ago',
      trend: 'stable',
      status: 'healthy'
    },
    {
      id: '6',
      name: 'Energy Drinks',
      currentStock: 32,
      maxCapacity: 40,
      category: 'Beverages',
      lastRestocked: '30 minutes ago',
      trend: 'up',
      status: 'healthy'
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('shelfmind_auth');
    const userData = localStorage.getItem('shelfmind_user');
    
    if (!isAuth) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('shelfmind_auth');
    localStorage.removeItem('shelfmind_user');
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'low': return 'bg-yellow-500';
      case 'critical': return 'bg-orange-500';
      case 'out': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      low: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-orange-100 text-orange-800',
      out: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleScan = () => {
    setIsScanning(true);
    showSuccess('Starting shelf scan...');
    
    setTimeout(() => {
      // Simulate some stock changes
      setProducts(prev => prev.map(product => {
        if (product.id === '2') {
          return { ...product, currentStock: 12, status: 'healthy' as const };
        }
        if (product.id === '4') {
          return { ...product, currentStock: 15, status: 'healthy' as const };
        }
        return product;
      }));
      
      setIsScanning(false);
      showSuccess('Shelf scan completed! Stock levels updated.');
    }, 3000);
  };

  const criticalItems = products.filter(p => p.status === 'critical' || p.status === 'out');
  const totalProducts = products.length;
  const healthyProducts = products.filter(p => p.status === 'healthy').length;
  const averageStock = Math.round(products.reduce((acc, p) => acc + getStockPercentage(p.currentStock, p.maxCapacity), 0) / totalProducts);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShelfMindLogo size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ShelfMind</h1>
              <p className="text-gray-600">AI-Powered Shelf Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Welcome, {user.name}</span>
            </div>
            <Button onClick={handleScan} disabled={isScanning} className="flex items-center space-x-2">
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Scan Shelves'}</span>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Across all shelves</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{healthyProducts}</div>
              <p className="text-xs text-muted-foreground">Well-stocked items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalItems.length}</div>
              <p className="text-xs text-muted-foreground">Need immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Stock</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{averageStock}%</div>
              <p className="text-xs text-muted-foreground">Across all products</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Alerts ({criticalItems.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge className={getStatusBadge(product.status)}>
                        {product.status.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription>{product.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stock Level</span>
                        <span>{product.currentStock}/{product.maxCapacity}</span>
                      </div>
                      <Progress 
                        value={getStockPercentage(product.currentStock, product.maxCapacity)} 
                        className="h-2"
                      />
                      <div className={`h-1 rounded-full ${getStatusColor(product.status)}`} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Last restocked: {product.lastRestocked}</span>
                      <span className={`flex items-center ${
                        product.trend === 'up' ? 'text-green-600' : 
                        product.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <TrendingUp className={`w-3 h-3 mr-1 ${
                          product.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        {product.trend}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Critical Stock Alerts</span>
                </CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                {criticalItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No critical alerts at this time! 🎉</p>
                ) : (
                  <div className="space-y-4">
                    {criticalItems.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                        <div>
                          <h3 className="font-semibold text-red-900">{product.name}</h3>
                          <p className="text-sm text-red-700">
                            {product.status === 'out' ? 'Out of stock' : `Only ${product.currentStock} left`}
                          </p>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          {product.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Distribution</CardTitle>
                  <CardDescription>Current inventory levels by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Beverages', 'Dairy', 'Bakery', 'Produce', 'Snacks'].map((category) => {
                      const categoryProducts = products.filter(p => p.category === category);
                      const avgStock = categoryProducts.length > 0 
                        ? Math.round(categoryProducts.reduce((acc, p) => acc + getStockPercentage(p.currentStock, p.maxCapacity), 0) / categoryProducts.length)
                        : 0;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{category}</span>
                            <span>{avgStock}%</span>
                          </div>
                          <Progress value={avgStock} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>Predictive analytics and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Restock Prediction</h4>
                      <p className="text-sm text-blue-700">Organic Milk will need restocking in 2-3 days based on current consumption patterns.</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">Optimization Tip</h4>
                      <p className="text-sm text-green-700">Energy Drinks are performing well. Consider increasing shelf space allocation.</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900">Trend Alert</h4>
                      <p className="text-sm text-yellow-700">Bakery items showing consistent decline. Review supplier or placement strategy.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;