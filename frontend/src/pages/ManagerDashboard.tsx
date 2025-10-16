import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Package, 
  AlertTriangle,
  Clock,
  CheckCircle,
  LogOut,
  User,
  BarChart3,
  Target,
  Zap,
  HelpCircle,
  MapPin,
  ArrowRight,
  Eye,
  Activity,
  Timer,
  Store,
  ShoppingCart,
  Percent
} from 'lucide-react';
import ShelfMindLogo from '@/components/ShelfMindLogo';
import { showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { User as UserType, StoreMetrics, Task } from '@/types';
import { getProductImage, getFallbackProductImage } from '@/utils/productImages';

interface AtRiskSKU {
  sku: string;
  name: string;
  aisle: string;
  currentStock: number;
  hoursUntilEmpty: number;
  predictedLostSales: number;
  category: string;
  priority: 'critical' | 'high' | 'medium';
  assignedTo?: string;
  taskStatus?: string;
  imageUrl?: string;
}

interface NearbyStore {
  id: string;
  name: string;
  distance: number;
  stockLevel: number;
  estimatedTransferTime: number;
  type: 'store' | 'dc';
}

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const atRiskSectionRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [metrics, setMetrics] = useState<StoreMetrics | null>(null);
  const [teamTasks, setTeamTasks] = useState<Task[]>([]);
  const [atRiskSKUs, setAtRiskSKUs] = useState<AtRiskSKU[]>([]);
  const [predictedLostSales, setPredictedLostSales] = useState({
    current: 0, // Will be calculated from actual at-risk SKUs
    trend: -8, // Negative trend shows improvement with ShelfMind
    timeframe: '2 hours',
    skusAtRisk: 0,
    aislesAffected: 0,
    topRiskAisle: 'Aisle A3 - Beverages'
  });

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('shelfmind_auth');
    const userData = localStorage.getItem('shelfmind_user');
    
    if (!isAuth) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'manager') {
        navigate('/associate');
        return;
      }
      setUser(parsedUser);
    }

    // Initialize mock data
    initializeData();
  }, [navigate]);

  const initializeData = () => {
    // Use the same realistic nearby stores data
    const mockNearbyStores: NearbyStore[] = [
      {
        id: 'store-002',
        name: 'Metro Fresh Westfield',
        distance: 2.3,
        stockLevel: 24,
        estimatedTransferTime: 2,
        type: 'store'
      },
      {
        id: 'store-003',
        name: 'Metro Fresh Mall Plaza',
        distance: 4.1,
        stockLevel: 18,
        estimatedTransferTime: 3,
        type: 'store'
      },
      {
        id: 'dc-001',
        name: 'Metro Distribution Center',
        distance: 12.5,
        stockLevel: 240,
        estimatedTransferTime: 24,
        type: 'dc'
      },
      {
        id: 'store-004',
        name: 'Metro Fresh Express',
        distance: 6.8,
        stockLevel: 15,
        estimatedTransferTime: 4,
        type: 'store'
      }
    ];

    // Realistic store metrics that tell a compelling story
    const mockMetrics: StoreMetrics = {
      totalProducts: 1247, // Typical grocery store SKU count
      healthyProducts: 1089, // 87% healthy stock levels
      criticalAlerts: 6, // Manageable number of critical items
      averageStock: 87, // Good OSA percentage
      tasksCompleted: 23, // Tasks completed today
      tasksPending: 6, // Active tasks needing attention
      salesUplift: 4.2, // 4.2% sales increase from better availability
      timeToRestock: 12, // Average 12 minutes to restock
      associateProductivity: 14.8, // Tasks per hour per associate
      customerSatisfaction: 96 // High satisfaction due to good availability
    };

    setMetrics(mockMetrics);

    // Create realistic team tasks that match Associate dashboard
    const mockTeamTasks: Task[] = [
      // HIGH PRIORITY TASKS - Critical revenue impact
      {
        id: 'task-1',
        productId: 'prod-1',
        product: {
          id: 'prod-1',
          name: 'Premium Coffee Beans',
          sku: 'BEV-001',
          currentStock: 3,
          maxCapacity: 48,
          category: 'Beverages',
          aisle: 'A3',
          shelf: 'Middle',
          lastRestocked: '4 hours ago',
          trend: 'down',
          status: 'critical',
          salesVelocity: 12.5,
          timeToEmpty: 1.4,
          revenueImpact: 187.50,
          backroomLocation: 'BR-A3-M2',
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage('BEV-001', 'Beverages', 'Premium Coffee Beans')
        },
        type: 'restock',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'Alex Rodriguez',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedTime: 8,
        urgencyScore: 95,
        instructions: 'URGENT: Restock Premium Coffee Beans from backroom BR-A3-M2',
        backroomLocation: 'BR-A3-M2',
        imageSessionId: 'img-1'
      },
      {
        id: 'task-2',
        productId: 'prod-2',
        product: {
          id: 'prod-2',
          name: 'Whole Wheat Bread',
          sku: 'BAK-001',
          currentStock: 0,
          maxCapacity: 32,
          category: 'Bakery',
          aisle: 'C2',
          shelf: 'Top',
          lastRestocked: '6 hours ago',
          trend: 'down',
          status: 'out',
          salesVelocity: 8.2,
          timeToEmpty: 0,
          revenueImpact: 32.80,
          backroomLocation: 'BR-C2-T1',
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage('BAK-001', 'Bakery', 'Whole Wheat Bread')
        },
        type: 'restock',
        priority: 'high',
        status: 'pending',
        assignedTo: 'Sarah Johnson',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 6,
        urgencyScore: 98,
        instructions: 'CRITICAL: Bread shelf is empty. Restock immediately from BR-C2-T1',
        backroomLocation: 'BR-C2-T1',
        imageSessionId: 'img-2'
      },
      {
        id: 'task-3',
        productId: 'prod-3',
        product: {
          id: 'prod-3',
          name: 'Organic Milk',
          sku: 'DAI-002',
          currentStock: 2,
          maxCapacity: 36,
          category: 'Dairy',
          aisle: 'B1',
          shelf: 'Bottom',
          lastRestocked: '5 hours ago',
          trend: 'down',
          status: 'critical',
          salesVelocity: 15.3,
          timeToEmpty: 0.8,
          revenueImpact: 91.80,
          backroomLocation: null,
          nearbyStores: mockNearbyStores.filter(store => ['store-002', 'dc-001'].includes(store.id)),
          imageUrl: getProductImage('DAI-002', 'Dairy', 'Organic Milk')
        },
        type: 'transfer',
        priority: 'high',
        status: 'pending',
        assignedTo: 'Mike Chen',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 25,
        urgencyScore: 92,
        instructions: 'URGENT: Transfer Organic Milk from Westfield store',
        transferStore: 'Metro Fresh Westfield',
        imageSessionId: 'img-2'
      },

      // MEDIUM PRIORITY TASKS
      {
        id: 'task-4',
        productId: 'prod-4',
        product: {
          id: 'prod-4',
          name: 'Chocolate Bars',
          sku: 'SNK-005',
          currentStock: 8,
          maxCapacity: 40,
          category: 'Snacks',
          aisle: 'A3',
          shelf: 'Middle',
          lastRestocked: '3 hours ago',
          trend: 'down',
          status: 'low',
          salesVelocity: 6.4,
          timeToEmpty: 3.2,
          revenueImpact: 25.60,
          backroomLocation: null,
          nearbyStores: mockNearbyStores.filter(store => ['store-002', 'store-003'].includes(store.id)),
          imageUrl: getProductImage('SNK-005', 'Snacks', 'Chocolate Bars')
        },
        type: 'transfer',
        priority: 'medium',
        status: 'pending',
        assignedTo: 'Alex Rodriguez',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 20,
        urgencyScore: 68,
        instructions: 'Transfer Chocolate Bars from nearby store',
        transferStore: 'Metro Fresh Westfield',
        imageSessionId: 'img-1'
      },
      {
        id: 'task-5',
        productId: 'prod-5',
        product: {
          id: 'prod-5',
          name: 'Orange Juice',
          sku: 'BEV-003',
          currentStock: 6,
          maxCapacity: 28,
          category: 'Beverages',
          aisle: 'A1',
          shelf: 'Bottom',
          lastRestocked: '4 hours ago',
          trend: 'stable',
          status: 'low',
          salesVelocity: 4.8,
          timeToEmpty: 5.5,
          revenueImpact: 28.80,
          backroomLocation: 'BR-A1-B1',
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage('BEV-003', 'Beverages', 'Orange Juice')
        },
        type: 'restock',
        priority: 'medium',
        status: 'pending',
        assignedTo: 'Mike Chen',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 7,
        urgencyScore: 55,
        instructions: 'Restock Orange Juice from backroom BR-A1-B1',
        backroomLocation: 'BR-A1-B1',
        imageSessionId: 'img-1'
      },

      // COMPLETED TASKS - Show team productivity
      {
        id: 'task-6',
        productId: 'prod-6',
        product: {
          id: 'prod-6',
          name: 'Energy Drinks',
          sku: 'BEV-004',
          currentStock: 16,
          maxCapacity: 24,
          category: 'Beverages',
          aisle: 'A1',
          shelf: 'Top',
          lastRestocked: '30 minutes ago',
          trend: 'up',
          status: 'healthy',
          salesVelocity: 5.6,
          timeToEmpty: 12.8,
          revenueImpact: 22.40,
          backroomLocation: null,
          nearbyStores: mockNearbyStores.filter(store => ['store-002', 'store-004'].includes(store.id)),
          imageUrl: getProductImage('BEV-004', 'Beverages', 'Energy Drinks')
        },
        type: 'transfer',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'Sarah Johnson',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedTime: 22,
        urgencyScore: 65,
        instructions: 'Transfer Energy Drinks from Westfield store - COMPLETED',
        transferStore: 'Metro Fresh Westfield',
        imageSessionId: 'img-1'
      },
      {
        id: 'task-7',
        productId: 'prod-7',
        product: {
          id: 'prod-7',
          name: 'Greek Yogurt',
          sku: 'DAI-004',
          currentStock: 18,
          maxCapacity: 32,
          category: 'Dairy',
          aisle: 'B1',
          shelf: 'Middle',
          lastRestocked: '45 minutes ago',
          trend: 'up',
          status: 'healthy',
          salesVelocity: 7.1,
          timeToEmpty: 9.2,
          revenueImpact: 35.50,
          backroomLocation: 'BR-B1-M3',
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage('DAI-004', 'Dairy', 'Greek Yogurt')
        },
        type: 'restock',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'Alex Rodriguez',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        estimatedTime: 6,
        urgencyScore: 58,
        instructions: 'Restock Greek Yogurt from backroom - COMPLETED',
        backroomLocation: 'BR-B1-M3',
        imageSessionId: 'img-2'
      }
    ];

    setTeamTasks(mockTeamTasks);

    // Create at-risk SKUs that match the task data exactly
    const mockAtRiskSKUs: AtRiskSKU[] = [
      {
        sku: 'BEV-001',
        name: 'Premium Coffee Beans',
        aisle: 'A3',
        currentStock: 3,
        hoursUntilEmpty: 1.4,
        predictedLostSales: 187.50, // Matches revenueImpact from task
        category: 'Beverages',
        priority: 'critical',
        assignedTo: 'Alex Rodriguez',
        taskStatus: 'in_progress',
        imageUrl: getProductImage('BEV-001', 'Beverages', 'Premium Coffee Beans')
      },
      {
        sku: 'BAK-001',
        name: 'Whole Wheat Bread',
        aisle: 'C2',
        currentStock: 0,
        hoursUntilEmpty: 0,
        predictedLostSales: 32.80, // Already losing sales - out of stock
        category: 'Bakery',
        priority: 'critical',
        assignedTo: 'Sarah Johnson',
        taskStatus: 'pending',
        imageUrl: getProductImage('BAK-001', 'Bakery', 'Whole Wheat Bread')
      },
      {
        sku: 'DAI-002',
        name: 'Organic Milk',
        aisle: 'B1',
        currentStock: 2,
        hoursUntilEmpty: 0.8,
        predictedLostSales: 91.80, // High-velocity item
        category: 'Dairy',
        priority: 'critical',
        assignedTo: 'Mike Chen',
        taskStatus: 'pending',
        imageUrl: getProductImage('DAI-002', 'Dairy', 'Organic Milk')
      },
      {
        sku: 'SNK-005',
        name: 'Chocolate Bars',
        aisle: 'A3',
        currentStock: 8,
        hoursUntilEmpty: 3.2,
        predictedLostSales: 25.60, // Lower priority but still significant
        category: 'Snacks',
        priority: 'high',
        assignedTo: 'Alex Rodriguez',
        taskStatus: 'pending',
        imageUrl: getProductImage('SNK-005', 'Snacks', 'Chocolate Bars')
      },
      {
        sku: 'BEV-003',
        name: 'Orange Juice',
        aisle: 'A1',
        currentStock: 6,
        hoursUntilEmpty: 5.5,
        predictedLostSales: 28.80, // Medium priority
        category: 'Beverages',
        priority: 'high',
        assignedTo: 'Mike Chen',
        taskStatus: 'pending',
        imageUrl: getProductImage('BEV-003', 'Beverages', 'Orange Juice')
      }
    ];

    setAtRiskSKUs(mockAtRiskSKUs);

    // Calculate realistic predicted lost sales from actual at-risk SKUs
    const totalPredictedLoss = mockAtRiskSKUs.reduce((sum, sku) => sum + sku.predictedLostSales, 0);
    const criticalSKUs = mockAtRiskSKUs.filter(sku => sku.priority === 'critical').length;
    const highSKUs = mockAtRiskSKUs.filter(sku => sku.priority === 'high').length;
    const totalAtRisk = criticalSKUs + highSKUs;
    const uniqueAisles = [...new Set(mockAtRiskSKUs.map(sku => sku.aisle))].length;
    
    setPredictedLostSales({
      current: Math.round(totalPredictedLoss), // $366 total predicted loss
      trend: -8, // Negative trend shows ShelfMind is working (8% improvement)
      timeframe: '2 hours',
      skusAtRisk: totalAtRisk, // 5 SKUs at risk
      aislesAffected: uniqueAisles, // 3 aisles affected
      topRiskAisle: 'Aisle A3 - Beverages' // Coffee + Chocolate = highest impact aisle
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('shelfmind_auth');
    localStorage.removeItem('shelfmind_user');
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  const handleShowTips = () => {
    showSuccess('💡 Demo Tip: Coffee ($187/hr) and Milk ($91/hr) are your highest-impact items. ShelfMind has reduced stockouts by 8% this week!');
  };

  const handleViewAtRiskSKUs = () => {
    if (atRiskSectionRef.current) {
      atRiskSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      showSuccess('📍 Viewing critical SKUs - Coffee and Milk need immediate attention!');
    }
  };

  const getRiskLevel = (amount: number) => {
    if (amount < 200) return { level: 'low', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (amount < 400) return { level: 'medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    return { level: 'high', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const risk = getRiskLevel(predictedLostSales.current);

  // Enhanced function to get SKU card styling based on priority
  const getSKUCardStyling = (sku: AtRiskSKU) => {
    const baseClasses = "hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]";
    
    switch (sku.priority) {
      case 'critical':
        return {
          cardClasses: `${baseClasses} bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 shadow-lg`,
          headerBg: 'bg-gradient-to-r from-red-100/80 to-rose-100/80',
          accentColor: 'text-red-700'
        };
      case 'high':
        return {
          cardClasses: `${baseClasses} bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 shadow-lg`,
          headerBg: 'bg-gradient-to-r from-orange-100/80 to-amber-100/80',
          accentColor: 'text-orange-700'
        };
      case 'medium':
        return {
          cardClasses: `${baseClasses} bg-gradient-to-r from-yellow-50 to-yellow-50 border-2 border-yellow-300 shadow-lg`,
          headerBg: 'bg-gradient-to-r from-yellow-100/80 to-yellow-100/80',
          accentColor: 'text-yellow-700'
        };
      default:
        return {
          cardClasses: `${baseClasses} bg-white border-2 border-gray-200 shadow-lg`,
          headerBg: 'bg-gray-50',
          accentColor: 'text-gray-700'
        };
    }
  };

  // Enhanced function to get team member card styling
  const getTeamCardStyling = (member: any) => {
    const baseClasses = "hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]";
    
    if (member.tasksActive > 0) {
      return {
        cardClasses: `${baseClasses} bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-md`,
        headerBg: 'bg-gradient-to-r from-blue-100/80 to-indigo-100/80',
        accentColor: 'text-blue-700'
      };
    }
    
    return {
      cardClasses: `${baseClasses} bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300 shadow-md`,
      headerBg: 'bg-gradient-to-r from-gray-100/80 to-slate-100/80',
      accentColor: 'text-gray-700'
    };
  };

  if (!user || !metrics) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const osaPrevious = 79; // Previous OSA percentage (before ShelfMind)
  const osaImprovement = metrics.averageStock - osaPrevious; // 8% improvement

  // Calculate realistic team performance metrics from actual task data
  const teamPerformance = [
    {
      name: 'Alex Rodriguez',
      tasksCompleted: teamTasks.filter(t => t.assignedTo === 'Alex Rodriguez' && t.status === 'completed').length,
      tasksActive: teamTasks.filter(t => t.assignedTo === 'Alex Rodriguez' && t.status === 'in_progress').length,
      tasksPending: teamTasks.filter(t => t.assignedTo === 'Alex Rodriguez' && t.status === 'pending').length,
      avgRate: 14.2, // Tasks per hour
      totalTasks: function() { return this.tasksCompleted + this.tasksActive + this.tasksPending; },
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Sarah Johnson',
      tasksCompleted: teamTasks.filter(t => t.assignedTo === 'Sarah Johnson' && t.status === 'completed').length,
      tasksActive: teamTasks.filter(t => t.assignedTo === 'Sarah Johnson' && t.status === 'in_progress').length,
      tasksPending: teamTasks.filter(t => t.assignedTo === 'Sarah Johnson' && t.status === 'pending').length,
      avgRate: 15.8, // Highest performer
      totalTasks: function() { return this.tasksCompleted + this.tasksActive + this.tasksPending; },
      photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Mike Chen',
      tasksCompleted: teamTasks.filter(t => t.assignedTo === 'Mike Chen' && t.status === 'completed').length,
      tasksActive: teamTasks.filter(t => t.assignedTo === 'Mike Chen' && t.status === 'in_progress').length,
      tasksPending: teamTasks.filter(t => t.assignedTo === 'Mike Chen' && t.status === 'pending').length,
      avgRate: 13.5, // Solid performer
      totalTasks: function() { return this.tasksCompleted + this.tasksActive + this.tasksPending; },
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* New Consolidated Dashboard Header */}
      <header className="bg-white border-b border-slate-200 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Side - Logo, Title & Store Info */}
            <div className="flex items-center space-x-6">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-3">
                <ShelfMindLogo size="md" />
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                    ShelfMind <span className="text-blue-600">Manager</span>
                  </h1>
                  <p className="text-sm text-slate-600 font-medium">
                    {user.storeName} • Operations Management
                  </p>
                </div>
              </div>
              
              {/* Store Status Indicator */}
              <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-sm font-semibold text-green-700">Store Active</span>
              </div>
            </div>
            
            {/* Right Side - Actions & Profile */}
            <div className="flex items-center space-x-4">
              {/* Help Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowTips}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 border-slate-300 hover:bg-slate-50 h-10 px-4 font-medium transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </Button>
              
              {/* Profile Section */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-300 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500 font-medium">Store Manager</div>
                </div>
              </div>
              
              {/* Logout Button */}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2 h-10 px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium transition-all duration-200 shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Store Overview Hero Section */}
        <Card className="retail-card relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=300&fit=crop&crop=center')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-blue-900/60"></div>
          </div>
          <CardContent className="relative z-10 p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold mb-2">Store Operations Overview</h2>
                <p className="text-blue-100 font-medium">Managing {metrics.totalProducts} SKUs across all departments</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">{metrics.averageStock}%</div>
                <div className="text-blue-200 text-sm font-medium">Current OSA</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HERO METRIC - Predicted Lost Sales */}
        <Card className={`retail-card shadow-lg border-2 ${risk.borderColor} ${risk.bgColor} cursor-pointer hover:shadow-xl transition-all duration-200`}>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              {/* Main Dollar Amount */}
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-2">PREDICTED LOST SALES</div>
                <div className={`text-6xl font-bold ${risk.color} mb-2`}>
                  ${predictedLostSales.current.toLocaleString()}
                </div>
                <div className="text-lg text-gray-600 font-medium">
                  Next {predictedLostSales.timeframe}
                </div>
              </div>

              {/* Trend Indicator - Shows ShelfMind Success */}
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-1">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {predictedLostSales.trend}% vs last week
                  </span>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  ShelfMind Impact: <span className="text-green-600 font-semibold">$2,840 saved this week</span>
                </div>
              </div>

              {/* Context Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{predictedLostSales.skusAtRisk}</div>
                  <div className="text-sm text-gray-600 font-medium">SKUs at Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{predictedLostSales.aislesAffected}</div>
                  <div className="text-sm text-gray-600 font-medium">Aisles Affected</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700 mb-1">Top Risk Area</div>
                  <div className="text-sm text-gray-600 font-medium">{predictedLostSales.topRiskAisle}</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleViewAtRiskSKUs}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 text-lg"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View At-Risk SKUs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Metrics - Enhanced with Better Colors */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="retail-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-800">Current OSA</CardTitle>
              <Percent className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{metrics.averageStock}%</div>
              <div className="flex items-center text-xs text-green-700 font-semibold">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{osaImprovement}% with ShelfMind
              </div>
            </CardContent>
          </Card>

          <Card className="retail-card bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-orange-800">Active Tasks</CardTitle>
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">{teamTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length}</div>
              <div className="text-xs text-orange-700 font-semibold">
                {teamTasks.filter(t => t.priority === 'high').length} high priority
              </div>
            </CardContent>
          </Card>

          <Card className="retail-card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-800">Avg Task Time</CardTitle>
              <Timer className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{metrics.timeToRestock}min</div>
              <div className="text-xs text-blue-700 font-semibold">
                Target: &lt;15min ✅
              </div>
            </CardContent>
          </Card>

          <Card className="retail-card bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-800">Team Productivity</CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{metrics.associateProductivity}</div>
              <div className="text-xs text-purple-700 font-semibold">
                tasks/hour per associate
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Views */}
        <div ref={atRiskSectionRef}>
          <Tabs defaultValue="at-risk" className="space-y-4">
            <TabsList className="bg-white border-2 border-gray-200 shadow-md">
              <TabsTrigger value="at-risk" className="font-semibold">At-Risk SKUs</TabsTrigger>
              <TabsTrigger value="team" className="font-semibold">Team Performance</TabsTrigger>
              <TabsTrigger value="analytics" className="font-semibold">Store Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="at-risk" className="space-y-4">
              <Card className="retail-card border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-100/80 to-rose-100/80 -m-6 mb-6 p-6 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <span className="text-lg font-bold">Critical SKUs Requiring Immediate Action</span>
                  </CardTitle>
                  <CardDescription className="text-red-700 font-semibold">
                    Products predicted to go out of stock within the next 2 hours - sorted by revenue impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {atRiskSKUs.map((sku, index) => {
                      const styling = getSKUCardStyling(sku);
                      
                      return (
                        <div key={sku.sku} className={styling.cardClasses}>
                          <div className={`${styling.headerBg} p-4 rounded-t-lg`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-1">
                                {/* Enhanced Product Image */}
                                <div className="flex-shrink-0">
                                  <img 
                                    src={sku.imageUrl || getFallbackProductImage(sku.category)} 
                                    alt={sku.name}
                                    className="w-16 h-16 rounded-xl border-2 border-white object-cover shadow-lg"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = getFallbackProductImage(sku.category);
                                    }}
                                  />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className={`font-bold text-lg ${styling.accentColor}`}>{sku.name}</div>
                                    <Badge className={`text-xs font-bold px-2 py-1 border-2 ${
                                      sku.priority === 'critical' ? 'bg-red-200 text-red-900 border-red-300' :
                                      sku.priority === 'high' ? 'bg-orange-200 text-orange-900 border-orange-300' :
                                      'bg-yellow-200 text-yellow-900 border-yellow-300'
                                    }`}>
                                      {sku.priority.toUpperCase()}
                                    </Badge>
                                    {sku.taskStatus && (
                                      <Badge className={`text-xs font-bold px-2 py-1 border-2 ${
                                        sku.taskStatus === 'in_progress' ? 'bg-blue-200 text-blue-900 border-blue-300' :
                                        sku.taskStatus === 'completed' ? 'bg-green-200 text-green-900 border-green-300' :
                                        'bg-gray-200 text-gray-900 border-gray-300'
                                      }`}>
                                        {sku.taskStatus === 'in_progress' ? 'ACTIVE' : sku.taskStatus.toUpperCase()}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-700 font-semibold">
                                    <div className="flex items-center space-x-6 bg-white/70 px-3 py-2 rounded-lg">
                                      <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-800">Aisle {sku.aisle}</span>
                                      <span className="bg-green-100 px-2 py-1 rounded-full text-green-800">Stock: {sku.currentStock} units</span>
                                      <span className="bg-purple-100 px-2 py-1 rounded-full text-purple-800">Empty in: {sku.hoursUntilEmpty}h</span>
                                      {sku.assignedTo && <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-800">Assigned: {sku.assignedTo}</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right bg-white/80 p-4 rounded-xl border-2 border-red-300">
                                <div className="text-2xl font-bold text-red-700">
                                  ${sku.predictedLostSales.toFixed(0)}
                                </div>
                                <div className="text-xs text-red-600 font-semibold">
                                  Lost sales/2h
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="retail-card border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 -m-6 mb-6 p-6 rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2 text-blue-800">
                      <Users className="w-6 h-6" />
                      <span className="text-lg font-bold">Team Performance Today</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {teamPerformance.map((member) => {
                        const styling = getTeamCardStyling(member);
                        
                        return (
                          <div key={member.name} className={styling.cardClasses}>
                            <div className={`${styling.headerBg} p-4 rounded-lg`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  {/* Enhanced Team Member Photo */}
                                  <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-white shadow-lg">
                                    <img 
                                      src={member.photoUrl} 
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className={`font-bold text-base ${styling.accentColor}`}>{member.name}</div>
                                    <div className="text-sm text-gray-700 font-semibold">
                                      Associate • On Shift • {member.tasksCompleted} completed, {member.tasksActive} active, {member.tasksPending} pending
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right bg-white/80 p-3 rounded-lg border border-gray-300">
                                  <div className="font-bold text-green-700 text-lg">{member.totalTasks()} tasks</div>
                                  <div className="text-sm text-gray-700 font-semibold">{member.avgRate}/hr avg</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="retail-card border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 -m-6 mb-6 p-6 rounded-t-lg">
                    <CardTitle className="text-green-800 text-lg font-bold">Active Task Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {teamTasks.filter(task => task.status !== 'completed').slice(0, 6).map((task) => (
                      <div key={task.id} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            {/* Enhanced Product Image */}
                            <div className="flex-shrink-0">
                              <img 
                                src={task.product.imageUrl || getFallbackProductImage(task.product.category)} 
                                alt={task.product.name}
                                className="w-10 h-10 rounded-lg border-2 border-white object-cover shadow-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = getFallbackProductImage(task.product.category);
                                }}
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="font-bold text-gray-900">{task.product.name}</div>
                              <div className="text-sm text-gray-700 font-semibold">
                                {task.assignedTo} • Aisle {task.product.aisle} • ${task.product.revenueImpact.toFixed(0)}/hr impact
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`font-bold px-3 py-1 border-2 ${
                              task.status === 'completed' ? 'bg-green-200 text-green-900 border-green-300' :
                              task.status === 'in_progress' ? 'bg-blue-200 text-blue-900 border-blue-300' :
                              'bg-orange-200 text-orange-900 border-orange-300'
                            }`}>
                              {task.status === 'in_progress' ? 'ACTIVE' : task.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="retail-card border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 -m-6 mb-6 p-6 rounded-t-lg">
                    <CardTitle className="text-green-800 text-lg font-bold">ShelfMind ROI Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white border-2 border-green-300 rounded-xl shadow-md">
                        <div className="text-3xl font-bold text-green-700">$2,840</div>
                        <div className="text-sm text-green-800 font-semibold">Revenue Protected This Week</div>
                      </div>
                      <div className="text-center p-4 bg-white border-2 border-blue-300 rounded-xl shadow-md">
                        <div className="text-3xl font-bold text-blue-700">+{metrics.salesUplift}%</div>
                        <div className="text-sm text-blue-800 font-semibold">Sales Increase</div>
                      </div>
                    </div>
                    <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-gray-200">
                      <div className="flex justify-between text-sm font-semibold">
                        <span>OSA Improvement</span>
                        <span className="font-bold text-green-700">+{osaImprovement}%</span>
                      </div>
                      <Progress value={osaImprovement * 10} className="h-3" />
                      <div className="text-xs text-gray-700 font-semibold">From 79% to {metrics.averageStock}% since ShelfMind deployment</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="retail-card border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-100/80 to-violet-100/80 -m-6 mb-6 p-6 rounded-t-lg">
                    <CardTitle className="text-purple-800 text-lg font-bold">AI Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="bg-white p-3 rounded-xl border-2 border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold">Prediction Accuracy</span>
                          <span className="text-sm font-bold text-green-700">94.2%</span>
                        </div>
                        <Progress value={94.2} className="h-2" />
                      </div>
                      
                      <div className="bg-white p-3 rounded-xl border-2 border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold">Task Success Rate</span>
                          <span className="text-sm font-bold text-blue-700">96.1%</span>
                        </div>
                        <Progress value={96.1} className="h-2" />
                      </div>
                      
                      <div className="bg-white p-3 rounded-xl border-2 border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold">Customer Satisfaction</span>
                          <span className="text-sm font-bold text-purple-700">{metrics.customerSatisfaction}%</span>
                        </div>
                        <Progress value={metrics.customerSatisfaction} className="h-2" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 bg-white p-3 rounded-xl border-2 border-gray-200 font-semibold">
                      <strong>Key Insight:</strong> High-velocity items (Coffee, Milk, Bread) drive 73% of stockout revenue impact
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;