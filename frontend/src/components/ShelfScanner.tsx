import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { DetectedProduct, ShelfScan } from '@/types';

interface ShelfScannerProps {
  onScanComplete: (scan: ShelfScan) => void;
}

const ShelfScanner: React.FC<ShelfScannerProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ShelfScan | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockDetectedProducts: DetectedProduct[] = [
    {
      sku: 'BEV-001',
      name: 'Premium Coffee Beans',
      count: 3,
      confidence: 0.92,
      gapDetected: true,
      position: { x: 10, y: 20, width: 100, height: 80 }
    },
    {
      sku: 'DAI-002',
      name: 'Organic Milk',
      count: 1,
      confidence: 0.88,
      gapDetected: true,
      position: { x: 120, y: 20, width: 90, height: 85 }
    },
    {
      sku: 'SNK-005',
      name: 'Chocolate Bars',
      count: 8,
      confidence: 0.95,
      gapDetected: false,
      position: { x: 220, y: 25, width: 110, height: 75 }
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIProcessing = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate AI processing steps
    const steps = [
      { progress: 25, message: 'Analyzing...' },
      { progress: 50, message: 'Detecting...' },
      { progress: 75, message: 'Counting...' },
      { progress: 100, message: 'Complete!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setScanProgress(step.progress);
    }

    // Generate mock scan result
    const scan: ShelfScan = {
      id: `scan-${Date.now()}`,
      imageUrl: selectedImage || '/placeholder-shelf.jpg',
      aisle: 'A3',
      shelf: 'Middle',
      detectedProducts: mockDetectedProducts,
      timestamp: new Date().toISOString(),
      scannedBy: 'alex-001',
      processingTime: 2.8
    };

    setScanResult(scan);
    setIsScanning(false);
    showSuccess('Scan completed successfully!');
    onScanComplete(scan);
  };

  const handleScan = () => {
    if (!selectedImage) {
      showError('Please select an image first');
      return;
    }
    simulateAIProcessing();
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    showError('Camera capture not available in demo. Please upload an image.');
  };

  const gapsDetected = scanResult?.detectedProducts.filter(p => p.gapDetected).length || 0;
  const totalProducts = scanResult?.detectedProducts.length || 0;

  return (
    <div className="space-y-6">
      {/* Image Upload/Capture */}
      <Card className="retail-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Scan className="w-5 h-5" />
            <span>AI Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedImage ? (
            <div className="space-y-4">
              <img 
                src={selectedImage} 
                alt="Selected shelf" 
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex space-x-2">
                <Button onClick={handleScan} disabled={isScanning} className="flex-1 btn-primary font-medium h-12">
                  {isScanning ? (
                    <>
                      <Scan className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Analyze Shelf
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedImage(null)}
                  disabled={isScanning}
                  className="btn-secondary font-medium h-12"
                >
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4 bg-gray-50">
              <div className="flex justify-center space-x-4">
                <Button onClick={handleCameraCapture} className="flex items-center space-x-2 btn-primary font-medium h-12">
                  <Camera className="w-4 h-4" />
                  <span>Take Photo</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 btn-secondary font-medium h-12"
                
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>AI Processing</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <Card className="retail-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-900">Scan Results</span>
              </div>
              <Badge variant="outline" className="font-medium">
                {scanResult.processingTime}s
              </Badge>
            </CardTitle>
            <CardDescription className="font-medium">
              Aisle {scanResult.aisle} • {scanResult.shelf} Shelf
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 status-info rounded-lg border">
                <Package className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                <div className="text-lg font-bold">{totalProducts}</div>
                <div className="text-xs text-gray-600 font-medium">Products</div>
              </div>
              <div className="text-center p-3 status-warning rounded-lg border">
                <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                <div className="text-lg font-bold">{gapsDetected}</div>
                <div className="text-xs text-gray-600 font-medium">Gaps</div>
              </div>
              <div className="text-center p-3 status-healthy rounded-lg border">
                <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
                <div className="text-lg font-bold">
                  {Math.round((scanResult.detectedProducts.reduce((acc, p) => acc + p.confidence, 0) / totalProducts) * 100)}%
                </div>
                <div className="text-xs text-gray-600 font-medium">Confidence</div>
              </div>
            </div>

            {/* Detected Products */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Detected Products</h4>
              {scanResult.detectedProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-600 font-medium">SKU: {product.sku}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{product.count}</div>
                    <div className="text-xs text-gray-600 font-medium">units</div>
                  </div>
                  <div>
                    {product.gapDetected ? (
                      <Badge className="status-warning font-medium">Gap</Badge>
                    ) : (
                      <Badge className="status-healthy font-medium">OK</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShelfScanner;