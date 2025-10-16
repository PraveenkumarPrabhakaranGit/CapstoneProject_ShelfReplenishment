import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Scan, 
  MapPin, 
  ArrowRight,
  LogOut,
  User,
  Package,
  Timer,
  TrendingUp,
  PlayCircle,
  CheckCircle2,
  Zap,
  Camera,
  List,
  Target,
  Award,
  ChevronRight,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Filter,
  X,
  BarChart3,
  History,
  Image,
  Trash2,
  Eye,
  Calendar,
  Download,
  Activity,
  Edit3,
  Settings,
  Store,
  Truck,
  Navigation,
  Building2
} from 'lucide-react';
import ShelfMindLogo from '@/components/ShelfMindLogo';
import ShelfScanner from '@/components/ShelfScanner';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { User as UserType, Task, Product, ShelfScan } from '@/types';
import { getProductImage, getFallbackProductImage } from '@/utils/productImages';

interface ImageSession {
  id: string;
  imageUrl: string;
  timestamp: string;
  aisle: string;
  shelf: string;
  detectedProducts: number;
  gapsFound: number;
  processingTime: number;
  scanData: ShelfScan;
  status: 'active' | 'completed';
}

interface NearbyStore {
  id: string;
  name: string;
  distance: number; // in miles
  stockLevel: number;
  estimatedTransferTime: number; // in hours
  type: 'store' | 'dc'; // store or distribution center
}

const AssociateDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [imageSessions, setImageSessions] = useState<ImageSession[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | 'active' | 'completed'>('active');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<ImageSession | null>(null);
  const [scannerExpanded, setScannerExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

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
      if (parsedUser.role !== 'associate') {
        navigate('/manager');
        return;
      }
      setUser(parsedUser);
    }

    // Initialize mock data
    initializeData();
  }, [navigate]);

  const initializeData = () => {
    // Create realistic nearby stores data
    const mockNearbyStores: NearbyStore[] = [
      {
        id: 'store-002',
        name: 'Metro Fresh Westfield',
        distance: 2.3,
        stockLevel: 24, // Realistic stock levels
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
        stockLevel: 240, // DC has much higher stock
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

    // Create realistic image sessions with meaningful data
    const mockImageSessions: ImageSession[] = [
      {
        id: 'img-1',
        imageUrl: '/placeholder-shelf.jpg',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        aisle: 'A3',
        shelf: 'Middle',
        detectedProducts: 4,
        gapsFound: 3, // 3 out of 4 products have gaps
        processingTime: 2.8,
        status: 'active',
        scanData: {
          id: 'scan-1',
          imageUrl: '/placeholder-shelf.jpg',
          aisle: 'A3',
          shelf: 'Middle',
          detectedProducts: [
            { sku: 'BEV-001', name: 'Premium Coffee Beans', count: 3, confidence: 0.94, gapDetected: true, position: { x: 10, y: 20, width: 100, height: 80 } },
            { sku: 'SNK-005', name: 'Chocolate Bars', count: 8, confidence: 0.96, gapDetected: true, position: { x: 220, y: 25, width: 110, height: 75 } }
          ],
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          scannedBy: 'alex-001',
          processingTime: 2.8
        }
      },
      {
        id: 'img-2',
        imageUrl: '/placeholder-shelf.jpg',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        aisle: 'B1',
        shelf: 'Bottom',
        detectedProducts: 3,
        gapsFound: 2,
        processingTime: 3.1,
        status: 'completed',
        scanData: {
          id: 'scan-2',
          imageUrl: '/placeholder-shelf.jpg',
          aisle: 'B1',
          shelf: 'Bottom',
          detectedProducts: [
            { sku: 'DAI-002', name: 'Organic Milk', count: 2, confidence: 0.91, gapDetected: true, position: { x: 120, y: 20, width: 90, height: 85 } }
          ],
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          scannedBy: 'alex-001',
          processingTime: 3.1
        }
      }
    ];

    // Create comprehensive, realistic task data with meaningful numbers
    const mockTasks: Task[] = [
      // HIGH PRIORITY - Critical revenue impact items
      {
        id: 'task-1',
        productId: 'prod-1',
        product: {
          id: 'prod-1',
          name: 'Premium Coffee Beans',
          sku: 'BEV-001',
          currentStock: 3, // Very low stock
          maxCapacity: 48, // Realistic shelf capacity
          category: 'Beverages',
          aisle: 'A3',
          shelf: 'Middle',
          lastRestocked: '4 hours ago',
          trend: 'down',
          status: 'critical',
          salesVelocity: 12.5, // High-velocity item (units per hour)
          timeToEmpty: 1.4, // Will be empty in 1.4 hours
          revenueImpact: 187.50, // $15 per unit × 12.5 units/hour = $187.50/hour lost
          backroomLocation: 'BR-A3-M2',
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage('BEV-001', 'Beverages', 'Premium Coffee Beans')
        },
        type: 'restock',
        priority: 'high',
        status: 'in_progress',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedTime: 8, // 8 minutes to restock from backroom
        urgencyScore: 95,
        instructions: 'URGENT: Restock Premium Coffee Beans from backroom BR-A3-M2. High-velocity item.',
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
          currentStock: 0, // Out of stock
          maxCapacity: 32,
          category: 'Bakery',
          aisle: 'C2',
          shelf: 'Top',
          lastRestocked: '6 hours ago',
          trend: 'down',
          status: 'out',
          salesVelocity: 8.2, // Bread is high-velocity
          timeToEmpty: 0, // Already empty
          revenueImpact: 32.80, // $4 per loaf × 8.2 loaves/hour
          backroomLocation: 'BR-C2-T1',
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage('BAK-001', 'Bakery', 'Whole Wheat Bread')
        },
        type: 'restock',
        priority: 'high',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 6,
        urgencyScore: 98, // Highest urgency - out of stock + high velocity
        instructions: 'CRITICAL: Bread shelf is empty. Restock immediately from BR-C2-T1.',
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
          currentStock: 2, // Very low
          maxCapacity: 36,
          category: 'Dairy',
          aisle: 'B1',
          shelf: 'Bottom',
          lastRestocked: '5 hours ago',
          trend: 'down',
          status: 'critical',
          salesVelocity: 15.3, // Milk is highest velocity item
          timeToEmpty: 0.8, // Less than 1 hour until empty
          revenueImpact: 91.80, // $6 per gallon × 15.3 gallons/hour
          backroomLocation: null, // No backroom stock
          nearbyStores: mockNearbyStores.filter(store => ['store-002', 'dc-001'].includes(store.id)),
          imageUrl: getProductImage('DAI-002', 'Dairy', 'Organic Milk')
        },
        type: 'transfer',
        priority: 'high',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 25, // Transfer takes longer
        urgencyScore: 92,
        instructions: 'URGENT: Transfer Organic Milk from Westfield store. No backroom stock available.',
        transferStore: 'Metro Fresh Westfield',
        imageSessionId: 'img-2'
      },

      // MEDIUM PRIORITY - Moderate impact items
      {
        id: 'task-4',
        productId: 'prod-4',
        product: {
          id: 'prod-4',
          name: 'Chocolate Bars',
          sku: 'SNK-005',
          currentStock: 8, // Low but not critical
          maxCapacity: 40,
          category: 'Snacks',
          aisle: 'A3',
          shelf: 'Middle',
          lastRestocked: '3 hours ago',
          trend: 'down',
          status: 'low',
          salesVelocity: 6.4, // Moderate velocity
          timeToEmpty: 3.2, // 3.2 hours until empty
          revenueImpact: 25.60, // $4 per bar × 6.4 bars/hour
          backroomLocation: null,
          nearbyStores: mockNearbyStores.filter(store => ['store-002', 'store-003'].includes(store.id)),
          imageUrl: getProductImage('SNK-005', 'Snacks', 'Chocolate Bars')
        },
        type: 'transfer',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 20,
        urgencyScore: 68,
        instructions: 'Transfer Chocolate Bars from nearby store. Monitor for afternoon rush.',
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
          currentStock: 6, // Moderate stock
          maxCapacity: 28,
          category: 'Beverages',
          aisle: 'A1',
          shelf: 'Bottom',
          lastRestocked: '4 hours ago',
          trend: 'stable',
          status: 'low',
          salesVelocity: 4.8, // Moderate velocity
          timeToEmpty: 5.5, // 5.5 hours until empty
          revenueImpact: 28.80, // $6 per bottle × 4.8 bottles/hour
          backroomLocation: 'BR-A1-B1',
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage('BEV-003', 'Beverages', 'Orange Juice')
        },
        type: 'restock',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 7,
        urgencyScore: 55,
        instructions: 'Restock Orange Juice from backroom BR-A1-B1. Morning rush item.',
        backroomLocation: 'BR-A1-B1',
        imageSessionId: 'img-1'
      },

      // LOW PRIORITY - Lower impact items
      {
        id: 'task-6',
        productId: 'prod-6',
        product: {
          id: 'prod-6',
          name: 'Potato Chips',
          sku: 'SNK-002',
          currentStock: 12, // Good stock level
          maxCapacity: 45,
          category: 'Snacks',
          aisle: 'A2',
          shelf: 'Top',
          lastRestocked: '2 hours ago',
          trend: 'stable',
          status: 'healthy',
          salesVelocity: 3.2, // Lower velocity
          timeToEmpty: 8.5, // 8.5 hours until empty
          revenueImpact: 12.80, // $4 per bag × 3.2 bags/hour
          backroomLocation: 'BR-A2-T2',
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage('SNK-002', 'Snacks', 'Potato Chips')
        },
        type: 'restock',
        priority: 'low',
        status: 'pending',
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 5,
        urgencyScore: 35,
        instructions: 'Restock Potato Chips when convenient. Low priority.',
        backroomLocation: 'BR-A2-T2',
        imageSessionId: 'img-1'
      },

      // COMPLETED TASKS - Show productivity
      {
        id: 'task-7',
        productId: 'prod-7',
        product: {
          id: 'prod-7',
          name: 'Energy Drinks',
          sku: 'BEV-004',
          currentStock: 16, // Well stocked after completion
          maxCapacity: 24,
          category: 'Beverages',
          aisle: 'A1',
          shelf: 'Top',
          lastRestocked: '30 minutes ago', // Recently completed
          trend: 'up',
          status: 'healthy',
          salesVelocity: 5.6,
          timeToEmpty: 12.8, // Good runway now
          revenueImpact: 22.40, // $4 per can × 5.6 cans/hour
          backroomLocation: null,
          nearbyStores: mockNearbyStores.filter(store => ['store-002', 'store-004'].includes(store.id)),
          imageUrl: getProductImage('BEV-004', 'Beverages', 'Energy Drinks')
        },
        type: 'transfer',
        priority: 'medium',
        status: 'completed',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Completed 30 min ago
        estimatedTime: 22,
        urgencyScore: 65,
        instructions: 'Transfer Energy Drinks from Westfield store - COMPLETED',
        transferStore: 'Metro Fresh Westfield',
        imageSessionId: 'img-1'
      },
      {
        id: 'task-8',
        productId: 'prod-8',
        product: {
          id: 'prod-8',
          name: 'Greek Yogurt',
          sku: 'DAI-004',
          currentStock: 18, // Well stocked after restock
          maxCapacity: 32,
          category: 'Dairy',
          aisle: 'B1',
          shelf: 'Middle',
          lastRestocked: '45 minutes ago',
          trend: 'up',
          status: 'healthy',
          salesVelocity: 7.1,
          timeToEmpty: 9.2,
          revenueImpact: 35.50, // $5 per container × 7.1 containers/hour
          backroomLocation: 'BR-B1-M3',
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage('DAI-004', 'Dairy', 'Greek Yogurt')
        },
        type: 'restock',
        priority: 'medium',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        estimatedTime: 6,
        urgencyScore: 58,
        instructions: 'Restock Greek Yogurt from backroom - COMPLETED',
        backroomLocation: 'BR-B1-M3',
        imageSessionId: 'img-2'
      }
    ];

    setImageSessions(mockImageSessions);
    setTasks(mockTasks);
  };

  const generateTasksFromScan = (scan: ShelfScan): Task[] => {
    // Mock nearby stores for generated tasks
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
      }
    ];

    return scan.detectedProducts
      .filter(detected => detected.gapDetected || detected.count < 8) // Create tasks for items needing attention
      .map((detected, index) => {
        // Determine realistic stock and capacity based on product type
        const isHighVelocity = detected.name.includes('Coffee') || detected.name.includes('Milk') || detected.name.includes('Bread');
        const maxCapacity = isHighVelocity ? 40 + Math.floor(Math.random() * 20) : 25 + Math.floor(Math.random() * 15);
        const salesVelocity = isHighVelocity ? 8 + Math.random() * 8 : 3 + Math.random() * 5;
        const unitPrice = detected.name.includes('Coffee') ? 15 : 
                         detected.name.includes('Milk') ? 6 :
                         detected.name.includes('Bread') ? 4 :
                         detected.name.includes('Chocolate') ? 4 : 3;
        
        // 70% chance of backroom stock for realistic scenario
        const hasBackroomStock = Math.random() > 0.3;
        const backroomLocation = hasBackroomStock ? `BR-${scan.aisle}-${scan.shelf.charAt(0)}${index + 1}` : null;

        const product: Product = {
          id: `${scan.id}-prod-${index}`,
          name: detected.name,
          sku: detected.sku,
          currentStock: detected.count,
          maxCapacity,
          category: detected.name.includes('Coffee') ? 'Beverages' : 
                    detected.name.includes('Milk') ? 'Dairy' :
                    detected.name.includes('Apple') ? 'Produce' :
                    detected.name.includes('Chocolate') ? 'Snacks' : 'General',
          aisle: scan.aisle,
          shelf: scan.shelf,
          lastRestocked: '2 hours ago',
          trend: detected.gapDetected ? 'down' : 'stable',
          status: detected.gapDetected ? (detected.count === 0 ? 'out' : detected.count < 3 ? 'critical' : 'low') : 'healthy',
          salesVelocity,
          timeToEmpty: detected.count === 0 ? 0 : detected.count / salesVelocity,
          revenueImpact: unitPrice * salesVelocity,
          backroomLocation,
          nearbyStores: mockNearbyStores,
          imageUrl: getProductImage(detected.sku, detected.name.includes('Coffee') ? 'Beverages' : 
                                   detected.name.includes('Milk') ? 'Dairy' :
                                   detected.name.includes('Apple') ? 'Produce' :
                                   detected.name.includes('Chocolate') ? 'Snacks' : 'General', detected.name)
        };

        // Calculate realistic urgency score
        const stockoutRisk = (maxCapacity - detected.count) / maxCapacity * 50;
        const velocityImpact = salesVelocity / 15 * 30;
        const revenueWeight = Math.min(product.revenueImpact / 100 * 20, 20);
        const urgencyScore = Math.round(stockoutRisk + velocityImpact + revenueWeight);

        return {
          id: `task-${scan.id}-${index}`,
          productId: product.id,
          product,
          type: hasBackroomStock ? 'restock' as const : 'transfer' as const,
          priority: product.status === 'out' || urgencyScore > 80 ? 'high' : urgencyScore > 50 ? 'medium' : 'low',
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedTime: hasBackroomStock ? 5 + Math.floor(Math.random() * 8) : 18 + Math.floor(Math.random() * 15),
          urgencyScore,
          instructions: hasBackroomStock 
            ? `Restock ${product.name} from backroom location ${backroomLocation}. Revenue impact: $${product.revenueImpact.toFixed(2)}/hour.`
            : `Transfer ${product.name} from nearby store - no backroom stock available. Revenue impact: $${product.revenueImpact.toFixed(2)}/hour.`,
          backroomLocation,
          transferStore: hasBackroomStock ? undefined : mockNearbyStores[0].name,
          imageSessionId: scan.id
        };
      });
  };

  const updateImageStatus = (imageId: string) => {
    const imageTasks = tasks.filter(task => task.imageSessionId === imageId);
    const allCompleted = imageTasks.length > 0 && imageTasks.every(task => task.status === 'completed');
    
    setImageSessions(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, status: allCompleted ? 'completed' : 'active' }
        : img
    ));

    // If image becomes completed and user is viewing active images, show success message
    if (allCompleted && selectedImageId === 'active') {
      showSuccess(`All tasks completed for ${imageSessions.find(img => img.id === imageId)?.aisle}-${imageSessions.find(img => img.id === imageId)?.shelf}! Moved to completed images.`);
    }
  };

  const getImageNameForTask = (task: Task): string => {
    const image = imageSessions.find(img => img.id === task.imageSessionId);
    return image ? `${image.aisle}-${image.shelf}` : 'Unknown';
  };

  const handleLogout = () => {
    localStorage.removeItem('shelfmind_auth');
    localStorage.removeItem('shelfmind_user');
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  const handleTaskUpdate = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status, updatedAt: new Date().toISOString() }
        : task
    ));

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const statusMessages = {
        completed: `✅ ${task.product.name} restocked successfully! Revenue protected: $${task.product.revenueImpact.toFixed(2)}/hour`,
        not_found: `❌ ${task.product.name} not found in backroom`,
        on_hold: `⏸️ ${task.product.name} task put on hold`,
        in_progress: `🔄 Started working on ${task.product.name} - ${task.estimatedTime} min estimated`
      };
      showSuccess(statusMessages[status] || 'Task updated');
      
      // Update image status after task completion
      if (task.imageSessionId) {
        setTimeout(() => updateImageStatus(task.imageSessionId!), 100);
      }
    }
  };

  const handlePriorityChange = (taskId: string, priority: Task['priority']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, priority, updatedAt: new Date().toISOString() }
        : task
    ));

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      showSuccess(`📋 ${task.product.name} priority changed to ${priority.toUpperCase()}`);
    }
  };

  const handleScanComplete = (scan: ShelfScan) => {
    // Create image session
    const imageSession: ImageSession = {
      id: scan.id,
      imageUrl: scan.imageUrl,
      timestamp: scan.timestamp,
      aisle: scan.aisle,
      shelf: scan.shelf,
      detectedProducts: scan.detectedProducts.length,
      gapsFound: scan.detectedProducts.filter(p => p.gapDetected).length,
      processingTime: scan.processingTime,
      scanData: scan,
      status: 'active'
    };

    // Generate tasks from scan
    const newTasks = generateTasksFromScan(scan);

    // Update state
    setImageSessions(prev => [imageSession, ...prev]);
    setTasks(prev => [...prev, ...newTasks]);
    setSelectedImageId('active'); // Auto-select active images view

    showSuccess(`Scan completed! Generated ${newTasks.length} tasks from ${scan.detectedProducts.length} detected products`);
    setScannerExpanded(false);
  };

  const handleDeleteImage = (imageId: string) => {
    // Remove image session
    setImageSessions(prev => prev.filter(img => img.id !== imageId));
    
    // Remove all tasks associated with this image
    const tasksToRemove = tasks.filter(task => task.imageSessionId === imageId);
    setTasks(prev => prev.filter(task => task.imageSessionId !== imageId));
    
    // Clear selected history item if it's the deleted one
    if (selectedHistoryItem?.id === imageId) {
      setSelectedHistoryItem(null);
    }

    showSuccess(`Deleted image and ${tasksToRemove.length} associated tasks`);
  };

  const handleViewHistoryItem = (item: ImageSession) => {
    setSelectedHistoryItem(item);
  };

  const handleShowTips = () => {
    showSuccess('💡 Tip: High-velocity items like Coffee ($187/hr) and Milk ($91/hr) have the biggest revenue impact when out of stock!');
  };

  // Toggle scanner expanded state
  const handleToggleScanner = () => {
    setScannerExpanded(!scannerExpanded);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'on_hold': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'not_found': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'Active';
      case 'completed': return 'Done';
      case 'pending': return 'Pending';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getReplenishmentGuidance = (task: Task) => {
    if (task.product.backroomLocation) {
      return {
        type: 'backroom',
        location: task.product.backroomLocation,
        icon: <Package className="w-4 h-4" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    } else if (task.product.nearbyStores && task.product.nearbyStores.length > 0) {
      const nearestStore = task.product.nearbyStores.sort((a, b) => a.distance - b.distance)[0];
      return {
        type: 'transfer',
        location: `${nearestStore.name} (${nearestStore.distance}mi)`,
        icon: nearestStore.type === 'dc' ? <Truck className="w-4 h-4" /> : <Store className="w-4 h-4" />,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        transferTime: nearestStore.estimatedTransferTime,
        stockLevel: nearestStore.stockLevel
      };
    }
    return null;
  };

  // Enhanced function to get task card styling based on priority and status
  const getTaskCardStyling = (task: Task) => {
    const baseClasses = "hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]";
    
    if (task.status === 'completed') {
      return {
        cardClasses: `${baseClasses} bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-md`,
        headerBg: 'bg-gradient-to-r from-green-100/80 to-emerald-100/80',
        accentColor: 'text-green-700'
      };
    }
    
    if (task.status === 'in_progress') {
      return {
        cardClasses: `${baseClasses} bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-md ring-2 ring-blue-200/50`,
        headerBg: 'bg-gradient-to-r from-blue-100/80 to-indigo-100/80',
        accentColor: 'text-blue-700'
      };
    }
    
    switch (task.priority) {
      case 'high':
        return {
          cardClasses: `${baseClasses} bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 shadow-md`,
          headerBg: 'bg-gradient-to-r from-red-100/80 to-rose-100/80',
          accentColor: 'text-red-700'
        };
      case 'medium':
        return {
          cardClasses: `${baseClasses} bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 shadow-md`,
          headerBg: 'bg-gradient-to-r from-yellow-100/80 to-amber-100/80',
          accentColor: 'text-yellow-700'
        };
      case 'low':
        return {
          cardClasses: `${baseClasses} bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300 shadow-md`,
          headerBg: 'bg-gradient-to-r from-gray-100/80 to-slate-100/80',
          accentColor: 'text-gray-700'
        };
      default:
        return {
          cardClasses: `${baseClasses} bg-white border-2 border-gray-200 shadow-md`,
          headerBg: 'bg-gray-50',
          accentColor: 'text-gray-700'
        };
    }
  };

  // Calculate active and completed images based on task completion status
  const activeImages = imageSessions.filter(img => {
    const imageTasks = tasks.filter(task => task.imageSessionId === img.id);
    return imageTasks.length > 0 && imageTasks.some(task => task.status !== 'completed');
  });

  const completedImages = imageSessions.filter(img => {
    const imageTasks = tasks.filter(task => task.imageSessionId === img.id);
    return imageTasks.length > 0 && imageTasks.every(task => task.status === 'completed');
  });

  // Filter tasks based on selected image category and filters
  const filteredTasks = tasks.filter(task => {
    let imageMatch = false;
    
    if (selectedImageId === 'active') {
      // Show tasks from all active images (images with incomplete tasks)
      const activeImageIds = activeImages.map(img => img.id);
      imageMatch = activeImageIds.includes(task.imageSessionId || '');
    } else if (selectedImageId === 'completed') {
      // Show tasks from all completed images (images with all tasks completed)
      const completedImageIds = completedImages.map(img => img.id);
      imageMatch = completedImageIds.includes(task.imageSessionId || '');
    }
    
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return imageMatch && statusMatch && priorityMatch;
  });

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');
  const lowTasks = filteredTasks.filter(t => t.priority === 'low');
  const mediumTasks = filteredTasks.filter(t => t.priority === 'medium');
  const highTasks = filteredTasks.filter(t => t.priority === 'high');

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
                    ShelfMind <span className="text-blue-600">Associate</span>
                  </h1>
                  <p className="text-sm text-slate-600 font-medium">
                    {user.storeName} • Floor Operations
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
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500 font-medium">Store Associate</div>
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

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Store Environment Hero Section */}
        <Card className="retail-card relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=300&fit=crop&crop=center')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
          </div>
          <CardContent className="relative z-10 p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Shift, {user.name.split(' ')[0]}!</h2>
                <p className="text-blue-100 font-medium">Ready to keep our shelves stocked and customers happy</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="text-blue-200 text-sm font-medium">{new Date().toLocaleDateString([], {weekday: 'long', month: 'short', day: 'numeric'})}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Scanner with Natural Toggle */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Shelf Scanner</h3>
                  <p className="text-purple-100 text-sm font-medium">
                    {scannerExpanded 
                      ? "Upload images to generate tasks - click to collapse when done"
                      : "Upload images to generate tasks - automatically move to completed when done"
                    }
                  </p>
                </div>
              </div>
              <div>
                <Button 
                  onClick={handleToggleScanner}
                  className="bg-white text-purple-600 hover:bg-purple-50 font-semibold h-10 px-6 transition-all duration-200"
                >
                  {scannerExpanded ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Close Scanner
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Scan Now
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Expanded Scanner */}
            {scannerExpanded && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="mb-4">
                  <h4 className="text-white font-semibold">Scanner Interface</h4>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <ShelfScanner onScanComplete={handleScanComplete} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Management - Smaller Tiles */}
        {(activeImages.length > 0 || completedImages.length > 0) && (
          <Card className="retail-card border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold">Image Management</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Filter tasks by completion status - images automatically move when all tasks are done
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center space-x-2">
                {/* Active Images Filter */}
                {activeImages.length > 0 && (
                  <Button
                    size="sm"
                    variant={selectedImageId === 'active' ? 'default' : 'outline'}
                    onClick={() => setSelectedImageId('active')}
                    className="h-7 px-2 text-xs font-medium whitespace-nowrap border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    Active ({activeImages.length})
                  </Button>
                )}
                
                {/* Completed Images Filter */}
                {completedImages.length > 0 && (
                  <Button
                    size="sm"
                    variant={selectedImageId === 'completed' ? 'default' : 'outline'}
                    onClick={() => setSelectedImageId('completed')}
                    className="h-7 px-2 text-xs font-medium whitespace-nowrap border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed ({completedImages.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Dashboard - Enhanced with Better Colors */}
        <Card className="retail-card border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
          <CardContent className="p-4">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-800">Task Dashboard</span>
                  {selectedImageId === 'active' && activeImages.length > 0 && (
                    <Badge className="bg-green-100 text-green-800 text-xs ml-2">
                      Active Images
                    </Badge>
                  )}
                  {selectedImageId === 'completed' && completedImages.length > 0 && (
                    <Badge className="bg-gray-100 text-gray-800 text-xs ml-2">
                      Completed Images
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-700 font-semibold bg-white px-3 py-1 rounded-full border border-blue-200">
                {filteredTasks.length} of {tasks.length} tasks
              </div>
            </div>
            
            {/* Status Overview - Enhanced */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-sm font-bold text-gray-700">Status Overview:</span>
              </div>
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                <Button
                  size="sm"
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className="h-7 px-3 text-xs font-semibold bg-white border-2 border-gray-300 hover:bg-gray-50"
                >
                  All ({filteredTasks.length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  className="h-7 px-3 text-xs font-semibold bg-orange-100 border-2 border-orange-300 text-orange-800 hover:bg-orange-200"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Pending ({pendingTasks.length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('in_progress')}
                  className="h-7 px-3 text-xs font-semibold bg-blue-100 border-2 border-blue-300 text-blue-800 hover:bg-blue-200"
                >
                  <PlayCircle className="w-3 h-3 mr-1" />
                  Active ({inProgressTasks.length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('completed')}
                  className="h-7 px-3 text-xs font-semibold bg-green-100 border-2 border-green-300 text-green-800 hover:bg-green-200"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Done ({completedTasks.length})
                </Button>
              </div>
            </div>

            {/* Priority Overview - Enhanced */}
            <div className="mb-3">
              <div className="flex items-center mb-2">
                <span className="text-sm font-bold text-gray-700">Priority Levels:</span>
              </div>
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                <Button
                  size="sm"
                  variant={priorityFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setPriorityFilter('all')}
                  className="h-7 px-3 text-xs font-semibold bg-white border-2 border-gray-300 hover:bg-gray-50"
                >
                  All ({filteredTasks.length})
                </Button>
                <Button
                  size="sm"
                  variant={priorityFilter === 'high' ? 'default' : 'outline'}
                  onClick={() => setPriorityFilter('high')}
                  className="h-7 px-3 text-xs font-semibold bg-red-100 border-2 border-red-300 text-red-800 hover:bg-red-200"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  High ({highTasks.length})
                </Button>
                <Button
                  size="sm"
                  variant={priorityFilter === 'medium' ? 'default' : 'outline'}
                  onClick={() => setPriorityFilter('medium')}
                  className="h-7 px-3 text-xs font-semibold bg-yellow-100 border-2 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Medium ({mediumTasks.length})
                </Button>
                <Button
                  size="sm"
                  variant={priorityFilter === 'low' ? 'default' : 'outline'}
                  onClick={() => setPriorityFilter('low')}
                  className="h-7 px-3 text-xs font-semibold bg-gray-100 border-2 border-gray-300 text-gray-800 hover:bg-gray-200"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Low ({lowTasks.length})
                </Button>
              </div>
            </div>

            {/* Active Filters Summary - Enhanced */}
            {(statusFilter !== 'all' || priorityFilter !== 'all') && (
              <div className="flex items-center justify-between pt-3 border-t-2 border-blue-200 bg-white/50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-blue-800">Active Filters:</span>
                  <div className="flex space-x-2">
                    {statusFilter !== 'all' && (
                      <Badge className="bg-blue-200 text-blue-900 text-xs px-2 py-1 font-semibold">
                        {statusFilter === 'in_progress' ? 'Active' : statusFilter === 'completed' ? 'Done' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      </Badge>
                    )}
                    {priorityFilter !== 'all' && (
                      <Badge className="bg-blue-200 text-blue-900 text-xs px-2 py-1 font-semibold">
                        {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter('all'); 
                    setPriorityFilter('all');
                  }}
                  className="h-7 px-3 text-xs font-semibold text-blue-800 border-2 border-blue-300 hover:bg-blue-100"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks Section - Enhanced with Better Visual Appeal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Tasks 
              {filteredTasks.length !== tasks.length && (
                <span className="text-base font-normal text-gray-600 ml-2">
                  ({filteredTasks.length} filtered)
                </span>
              )}
            </h2>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-700 font-semibold bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                Total Revenue at Risk:  <span className="font-bold text-red-700 text-base">
                  ${filteredTasks.filter(t => t.status !== 'completed').reduce((sum, task) => sum + task.product.revenueImpact, 0).toFixed(2)}/hour
                </span>
              </div>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 h-8 px-3 text-xs font-semibold border-2 border-gray-300 hover:bg-gray-50">
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {tasks.length === 0 ? (
            <Card className="retail-card">
              <CardContent className="text-center py-8">
                <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No images uploaded yet</h3>
                <p className="text-gray-600 mb-4 text-sm">Upload shelf images to generate tasks automatically</p>
                <Button onClick={handleToggleScanner} className="btn-primary h-8 px-4 text-sm">
                  <Camera className="w-3 h-3 mr-2" />
                  Upload First Image
                </Button>
              </CardContent>
            </Card>
          ) : filteredTasks.length === 0 ? (
            <Card className="retail-card">
              <CardContent className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No tasks match your filters</h3>
                <p className="text-gray-600 mb-4 text-sm">Try adjusting your filter settings</p>
                <Button onClick={() => {setStatusFilter('all'); setPriorityFilter('all');}} className="btn-primary h-8 px-4 text-sm">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTasks.slice(0, 15).map((task) => {
                const guidance = getReplenishmentGuidance(task);
                const styling = getTaskCardStyling(task);
                
                return (
                  <Card key={task.id} className={styling.cardClasses}>
                    <CardContent className="p-4">
                      {/* Enhanced Header Section with Better Visual Hierarchy */}
                      <div className={`${styling.headerBg} -m-4 mb-4 p-4 rounded-t-lg`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            {/* Enhanced Product Image */}
                            <div className="flex-shrink-0">
                              <img 
                                src={task.product.imageUrl || getFallbackProductImage(task.product.category)} 
                                alt={task.product.name}
                                className="w-12 h-12 rounded-xl border-2 border-white object-cover shadow-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = getFallbackProductImage(task.product.category);
                                }}
                              />
                            </div>
                            
                            {/* Enhanced Priority Icon */}
                            <div className={`p-2 rounded-full flex-shrink-0 shadow-sm ${
                              task.priority === 'high' ? 'bg-red-200 text-red-700' : 
                              task.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' : 
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {getUrgencyIcon(task.priority)}
                            </div>
                            
                            {/* Enhanced Task Information */}
                            <div className="flex-1 min-w-0">
                              {/* Product Name & Revenue Impact */}
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className={`text-base font-bold ${styling.accentColor} truncate`}>{task.product.name}</h3>
                                <Badge className="bg-white/80 text-gray-700 text-xs font-semibold px-2 py-1 flex-shrink-0 border border-gray-300">
                                  {getImageNameForTask(task)}
                                </Badge>
                                {task.status !== 'completed' && (
                                  <Badge className="bg-red-200 text-red-900 text-xs font-bold px-2 py-1 flex-shrink-0 border border-red-300">
                                    ${task.product.revenueImpact.toFixed(0)}/hr
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Priority Control & Status Display */}
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-semibold text-gray-700">Priority:</span>
                                  <Select value={task.priority} onValueChange={(value) => handlePriorityChange(task.id, value as Task['priority'])}>
                                    <SelectTrigger className={`w-auto h-6 px-2 text-xs font-bold border-2 cursor-pointer transition-colors ${getPriorityColor(task.priority)}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="high" className="text-xs">
                                        <div className="flex items-center space-x-2">
                                          <AlertTriangle className="w-3 h-3 text-red-600" />
                                          <span>HIGH</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="medium" className="text-xs">
                                        <div className="flex items-center space-x-2">
                                          <Clock className="w-3 h-3 text-yellow-600" />
                                          <span>MEDIUM</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="low" className="text-xs">
                                        <div className="flex items-center space-x-2">
                                          <CheckCircle className="w-3 h-3 text-green-600" />
                                          <span>LOW</span>
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                {/* Enhanced Status Display */}
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-semibold text-gray-700">Status:</span>
                                  <Badge className={`text-xs font-bold px-2 py-1 border-2 ${getStatusColor(task.status)}`}>
                                    {getStatusDisplayText(task.status)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Action Buttons */}
                          {task.status !== 'completed' && (
                            <div className="flex items-center space-x-2 ml-3">
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleTaskUpdate(task.id, 'in_progress')}
                                className="h-8 px-3 text-xs font-semibold border-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                                disabled={task.status === 'in_progress'}
                              >
                                {task.status === 'in_progress' ? 'Active' : 'Start'}
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleTaskUpdate(task.id, 'completed')}
                                className="h-8 px-3 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white border-2 border-green-600"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Done
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Smart Replenishment Guidance */}
                      {guidance && (
                        <div className={`mb-3 p-3 rounded-xl border-l-4 ${guidance.bgColor} ${guidance.borderColor} shadow-sm`}>
                          <div className="flex items-start space-x-3">
                            <div className={`${guidance.color} mt-0.5 p-1 rounded-full bg-white/50`}>
                              {guidance.icon}
                            </div>
                            <div className="flex-1">
                              <div className={`text-sm font-bold ${guidance.color} mb-1`}>
                                {guidance.type === 'backroom' ? '📦 Backroom Stock Available' : '🚚 Transfer Required'}
                              </div>
                              <div className="text-sm text-gray-800 font-medium">
                                {guidance.type === 'backroom' ? (
                                  <span>
                                    <strong>Location:</strong> {guidance.location}
                                  </span>
                                ) : (
                                  <div className="space-y-1">
                                    <div><strong>From:</strong> {guidance.location}</div>
                                    <div className="flex items-center space-x-4 text-xs text-gray-700 font-semibold">
                                      {guidance.transferTime && (
                                        <span className="bg-white/70 px-2 py-1 rounded-full">⏱️ ETA: {guidance.transferTime}h</span>
                                      )}
                                      {guidance.stockLevel && (
                                        <span className="bg-white/70 px-2 py-1 rounded-full">📦 Stock: {guidance.stockLevel} units</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Enhanced Task Details with Better Visual Appeal */}
                      <div className="flex items-center justify-between text-sm text-gray-700 bg-white/70 rounded-xl p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-full">
                            <MapPin className="w-3 h-3 text-blue-600" />
                            <span className="font-semibold text-blue-800">Aisle {task.product.aisle}</span>
                          </span>
                          <span className="flex items-center space-x-1 bg-purple-100 px-2 py-1 rounded-full">
                            <Timer className="w-3 h-3 text-purple-600" />
                            <span className="font-semibold text-purple-800">~{task.estimatedTime}min</span>
                          </span>
                          <span className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                            <Package className="w-3 h-3 text-green-600" />
                            <span className="font-semibold text-green-800">{task.product.currentStock}/{task.product.maxCapacity}</span>
                          </span>
                          {task.type === 'transfer' && (
                            <span className="flex items-center space-x-1 bg-orange-100 px-2 py-1 rounded-full">
                              <Truck className="w-3 h-3 text-orange-600" />
                              <span className="font-semibold text-orange-800">Transfer</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 font-semibold bg-gray-100 px-2 py-1 rounded-full">
                          SKU: {task.product.sku}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredTasks.length > 15 && (
                <Card className="retail-card bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300">
                  <CardContent className="p-4 text-center">
                    <p className="text-gray-700 mb-3 text-sm font-semibold">
                      {filteredTasks.length - 15} more tasks available
                    </p>
                    <Button variant="outline" className="h-8 px-4 text-sm font-semibold border-2 border-gray-300 hover:bg-gray-100">
                      <List className="w-3 h-3 mr-2" />
                      View All Tasks
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssociateDashboard;