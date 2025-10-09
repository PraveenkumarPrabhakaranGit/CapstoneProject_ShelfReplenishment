export interface User {
  id: string;
  email: string;
  name: string;
  role: 'associate' | 'manager';
  storeId: string;
  storeName: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  maxCapacity: number;
  category: string;
  aisle: string;
  shelf: string;
  lastRestocked: string;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'low' | 'critical' | 'out';
  salesVelocity: number; // units per hour
  timeToEmpty: number; // hours until OOS
  revenueImpact: number; // $ per hour if OOS
  backroomLocation?: string;
  nearbyStores?: string[];
  imageUrl?: string; // Product image for visual identification
}

export interface Task {
  id: string;
  productId: string;
  product: Product;
  type: 'restock' | 'transfer' | 'audit';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'not_found' | 'on_hold';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  estimatedTime: number; // minutes
  urgencyScore: number;
  instructions?: string;
  backroomLocation?: string;
  transferStore?: string;
  imageSessionId?: string; // Link to image session that generated this task
}

export interface ShelfScan {
  id: string;
  imageUrl: string;
  aisle: string;
  shelf: string;
  detectedProducts: DetectedProduct[];
  timestamp: string;
  scannedBy: string;
  processingTime: number; // seconds
}

export interface DetectedProduct {
  sku: string;
  name: string;
  count: number;
  confidence: number;
  gapDetected: boolean;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface StoreMetrics {
  totalProducts: number;
  healthyProducts: number;
  criticalAlerts: number;
  averageStock: number;
  tasksCompleted: number;
  tasksPending: number;
  salesUplift: number;
  timeToRestock: number; // average minutes
  associateProductivity: number; // tasks per hour
  customerSatisfaction: number; // percentage
}