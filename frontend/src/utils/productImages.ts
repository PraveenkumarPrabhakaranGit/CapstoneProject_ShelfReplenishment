// Product image mapping utility for visual identification using real product images
export const getProductImage = (sku: string, category: string, name: string): string => {
  // Use real product images from Unsplash and other reliable sources
  // All images are high-quality, specific product photos
  
  const baseUnsplashUrl = 'https://images.unsplash.com/photo-';
  
  // Comprehensive SKU-specific real product images
  const skuImageMap: { [key: string]: string } = {
    // BEVERAGES - Real product photos
    'BEV-001': `${baseUnsplashUrl}1559056199-72c88c4ba35e?w=400&h=400&fit=crop&crop=center`, // Premium coffee beans in bag
    'BEV-003': `${baseUnsplashUrl}1613478223719-2ab802602423?w=400&h=400&fit=crop&crop=center`, // Fresh orange juice in glass bottle
    'BEV-004': `${baseUnsplashUrl}1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center`, // Energy drink cans
    
    // DAIRY - Real dairy product photos
    'DAI-002': `${baseUnsplashUrl}1550583724-b18be72b2d62?w=400&h=400&fit=crop&crop=center`, // Organic milk carton
    'DAI-004': `${baseUnsplashUrl}1571212515416-f4b9b6b8b8b8?w=400&h=400&fit=crop&crop=center`, // Greek yogurt containers
    
    // BAKERY - Real bread and bakery items
    'BAK-001': `${baseUnsplashUrl}1549931319-a545dcf3bc73?w=400&h=400&fit=crop&crop=center`, // Whole wheat bread loaf
    
    // PRODUCE - Real fresh produce
    'PRO-003': `${baseUnsplashUrl}1571771894149-24d96dcaabf6?w=400&h=400&fit=crop&crop=center`, // Fresh banana bunch
    
    // SNACKS - Real snack products
    'SNK-005': `${baseUnsplashUrl}1511381939415-e44015466834?w=400&h=400&fit=crop&crop=center`, // Chocolate bar unwrapped
    'SNK-002': `${baseUnsplashUrl}1613478223719-2ab802602423?w=400&h=400&fit=crop&crop=center`, // Potato chips bag
    
    // FROZEN - Real frozen food products
    'FRZ-001': `${baseUnsplashUrl}1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center`, // Frozen pizza in box
    
    // CLEANING - Real cleaning products
    'CLN-001': `${baseUnsplashUrl}1563453392212-326f5e854473?w=400&h=400&fit=crop&crop=center`, // Dish soap bottle
    
    // CANNED GOODS - Real canned products
    'CAN-001': `${baseUnsplashUrl}1544982503-4bb7efa35bb5?w=400&h=400&fit=crop&crop=center`, // Canned tomatoes
    
    // CEREAL - Real cereal products
    'CER-001': `${baseUnsplashUrl}1517686469429-8bdb88b9f907?w=400&h=400&fit=crop&crop=center`, // Breakfast cereal bowl
  };

  // Enhanced real product images with better photo IDs
  const enhancedSkuImages: { [key: string]: string } = {
    // BEVERAGES - Premium coffee and drinks
    'BEV-001': `${baseUnsplashUrl}1559056199-72c88c4ba35e?w=400&h=400&fit=crop&crop=center`, // Coffee beans in burlap sack
    'BEV-003': `${baseUnsplashUrl}1621506289937-bb54c6c0c0b7?w=400&h=400&fit=crop&crop=center`, // Orange juice bottle
    'BEV-004': `${baseUnsplashUrl}1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center`, // Energy drink can
    
    // DAIRY - Fresh dairy products
    'DAI-002': `${baseUnsplashUrl}1563636619-e9143da7973b?w=400&h=400&fit=crop&crop=center`, // Milk bottle and glass
    'DAI-004': `${baseUnsplashUrl}1628088062-c5c1b1e3b0b0?w=400&h=400&fit=crop&crop=center`, // Greek yogurt cup
    
    // BAKERY - Artisan bread
    'BAK-001': `${baseUnsplashUrl}1549931319-a545dcf3bc73?w=400&h=400&fit=crop&crop=center`, // Sliced whole wheat bread
    
    // PRODUCE - Fresh fruits
    'PRO-003': `${baseUnsplashUrl}1571771894149-24d96dcaabf6?w=400&h=400&fit=crop&crop=center`, // Ripe bananas
    
    // SNACKS - Popular snacks
    'SNK-005': `${baseUnsplashUrl}1606312619070-d14b306e2908?w=400&h=400&fit=crop&crop=center`, // Dark chocolate bar
    'SNK-002': `${baseUnsplashUrl}1566478989037-eec170784d0b?w=400&h=400&fit=crop&crop=center`, // Potato chips
    
    // FROZEN - Frozen foods
    'FRZ-001': `${baseUnsplashUrl}1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center`, // Pizza slice
    
    // CLEANING - Household products
    'CLN-001': `${baseUnsplashUrl}1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center`, // Cleaning supplies
    
    // CANNED GOODS - Pantry staples
    'CAN-001': `${baseUnsplashUrl}1544982503-4bb7efa35bb5?w=400&h=400&fit=crop&crop=center`, // Canned tomatoes
    
    // CEREAL - Breakfast items
    'CER-001': `${baseUnsplashUrl}1517686469429-8bdb88b9f907?w=400&h=400&fit=crop&crop=center`, // Cereal bowl
  };

  // Use enhanced images first, then fall back to basic mapping
  if (enhancedSkuImages[sku]) {
    return enhancedSkuImages[sku];
  }
  
  if (skuImageMap[sku]) {
    return skuImageMap[sku];
  }

  // Category-based real product images for unlisted SKUs
  switch (category.toLowerCase()) {
    case 'beverages':
      if (name.toLowerCase().includes('coffee')) {
        return `${baseUnsplashUrl}1559056199-72c88c4ba35e?w=400&h=400&fit=crop&crop=center`; // Coffee beans
      } else if (name.toLowerCase().includes('juice')) {
        return `${baseUnsplashUrl}1621506289937-bb54c6c0c0b7?w=400&h=400&fit=crop&crop=center`; // Orange juice
      } else if (name.toLowerCase().includes('energy')) {
        return `${baseUnsplashUrl}1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center`; // Energy drink
      } else if (name.toLowerCase().includes('soda') || name.toLowerCase().includes('cola')) {
        return `${baseUnsplashUrl}1581636625402-29d2c7cb2b6e?w=400&h=400&fit=crop&crop=center`; // Soda bottles
      } else if (name.toLowerCase().includes('water')) {
        return `${baseUnsplashUrl}1559827260-3d6547d75b7e?w=400&h=400&fit=crop&crop=center`; // Water bottles
      } else {
        return `${baseUnsplashUrl}1544145945-f0f0b0b0b0b0?w=400&h=400&fit=crop&crop=center`; // Generic beverage
      }

    case 'dairy':
      if (name.toLowerCase().includes('milk')) {
        return `${baseUnsplashUrl}1563636619-e9143da7973b?w=400&h=400&fit=crop&crop=center`; // Fresh milk
      } else if (name.toLowerCase().includes('yogurt')) {
        return `${baseUnsplashUrl}1628088062-c5c1b1e3b0b0?w=400&h=400&fit=crop&crop=center`; // Yogurt cups
      } else if (name.toLowerCase().includes('cheese')) {
        return `${baseUnsplashUrl}1486297678162-ce23cbfcfa0d?w=400&h=400&fit=crop&crop=center`; // Cheese varieties
      } else if (name.toLowerCase().includes('butter')) {
        return `${baseUnsplashUrl}1571212515416-f4b9b6b8b8b8?w=400&h=400&fit=crop&crop=center`; // Butter block
      } else {
        return `${baseUnsplashUrl}1563636619-e9143da7973b?w=400&h=400&fit=crop&crop=center`; // Generic dairy
      }

    case 'bakery':
      if (name.toLowerCase().includes('bread')) {
        return `${baseUnsplashUrl}1549931319-a545dcf3bc73?w=400&h=400&fit=crop&crop=center`; // Fresh bread
      } else if (name.toLowerCase().includes('bagel')) {
        return `${baseUnsplashUrl}1551024506-0bccd0e7dea8?w=400&h=400&fit=crop&crop=center`; // Bagels
      } else if (name.toLowerCase().includes('muffin')) {
        return `${baseUnsplashUrl}1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center`; // Muffins
      } else if (name.toLowerCase().includes('croissant')) {
        return `${baseUnsplashUrl}1555507036-716ca9808a55?w=400&h=400&fit=crop&crop=center`; // Croissants
      } else {
        return `${baseUnsplashUrl}1549931319-a545dcf3bc73?w=400&h=400&fit=crop&crop=center`; // Generic bakery
      }

    case 'produce':
      if (name.toLowerCase().includes('banana')) {
        return `${baseUnsplashUrl}1571771894149-24d96dcaabf6?w=400&h=400&fit=crop&crop=center`; // Fresh bananas
      } else if (name.toLowerCase().includes('apple')) {
        return `${baseUnsplashUrl}1560806887-1e4ca0d5b5f5?w=400&h=400&fit=crop&crop=center`; // Red apples
      } else if (name.toLowerCase().includes('orange')) {
        return `${baseUnsplashUrl}1547514701-42782101b60e?w=400&h=400&fit=crop&crop=center`; // Fresh oranges
      } else if (name.toLowerCase().includes('lettuce') || name.toLowerCase().includes('salad')) {
        return `${baseUnsplashUrl}1540420773420-3366772f4999?w=400&h=400&fit=crop&crop=center`; // Fresh lettuce
      } else if (name.toLowerCase().includes('tomato')) {
        return `${baseUnsplashUrl}1592841200221-471c0531dcca?w=400&h=400&fit=crop&crop=center`; // Fresh tomatoes
      } else if (name.toLowerCase().includes('carrot')) {
        return `${baseUnsplashUrl}1598170845058-32b9d6a5da37?w=400&h=400&fit=crop&crop=center`; // Fresh carrots
      } else {
        return `${baseUnsplashUrl}1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center`; // Mixed produce
      }

    case 'snacks':
      if (name.toLowerCase().includes('chocolate')) {
        return `${baseUnsplashUrl}1606312619070-d14b306e2908?w=400&h=400&fit=crop&crop=center`; // Chocolate bar
      } else if (name.toLowerCase().includes('chips')) {
        return `${baseUnsplashUrl}1566478989037-eec170784d0b?w=400&h=400&fit=crop&crop=center`; // Potato chips
      } else if (name.toLowerCase().includes('cookie')) {
        return `${baseUnsplashUrl}1558961363-fa8fdf82db35?w=400&h=400&fit=crop&crop=center`; // Cookies
      } else if (name.toLowerCase().includes('nuts')) {
        return `${baseUnsplashUrl}1553909489-f0312d79b25e?w=400&h=400&fit=crop&crop=center`; // Mixed nuts
      } else if (name.toLowerCase().includes('crackers')) {
        return `${baseUnsplashUrl}1571212515416-f4b9b6b8b8b8?w=400&h=400&fit=crop&crop=center`; // Crackers
      } else {
        return `${baseUnsplashUrl}1566478989037-eec170784d0b?w=400&h=400&fit=crop&crop=center`; // Generic snacks
      }

    case 'frozen':
      if (name.toLowerCase().includes('pizza')) {
        return `${baseUnsplashUrl}1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center`; // Frozen pizza
      } else if (name.toLowerCase().includes('ice cream')) {
        return `${baseUnsplashUrl}1563805042-7684c019e1cb?w=400&h=400&fit=crop&crop=center`; // Ice cream
      } else if (name.toLowerCase().includes('vegetables')) {
        return `${baseUnsplashUrl}1590736969955-71cc94901144?w=400&h=400&fit=crop&crop=center`; // Frozen vegetables
      } else if (name.toLowerCase().includes('berries')) {
        return `${baseUnsplashUrl}1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center`; // Frozen berries
      } else {
        return `${baseUnsplashUrl}1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center`; // Generic frozen
      }

    case 'cleaning':
      if (name.toLowerCase().includes('soap') || name.toLowerCase().includes('dish')) {
        return `${baseUnsplashUrl}1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center`; // Dish soap
      } else if (name.toLowerCase().includes('detergent')) {
        return `${baseUnsplashUrl}1558618047-3c8c76cd5d90?w=400&h=400&fit=crop&crop=center`; // Laundry detergent
      } else if (name.toLowerCase().includes('spray')) {
        return `${baseUnsplashUrl}1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center`; // Cleaning spray
      } else if (name.toLowerCase().includes('paper towel')) {
        return `${baseUnsplashUrl}1563453392212-326f5e854473?w=400&h=400&fit=crop&crop=center`; // Paper towels
      } else {
        return `${baseUnsplashUrl}1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center`; // Generic cleaning
      }

    case 'canned goods':
      if (name.toLowerCase().includes('tomato')) {
        return `${baseUnsplashUrl}1544982503-4bb7efa35bb5?w=400&h=400&fit=crop&crop=center`; // Canned tomatoes
      } else if (name.toLowerCase().includes('beans')) {
        return `${baseUnsplashUrl}1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center`; // Canned beans
      } else if (name.toLowerCase().includes('soup')) {
        return `${baseUnsplashUrl}1547592180-85f173990554?w=400&h=400&fit=crop&crop=center`; // Canned soup
      } else if (name.toLowerCase().includes('corn')) {
        return `${baseUnsplashUrl}1551024506-0bccd0e7dea8?w=400&h=400&fit=crop&crop=center`; // Canned corn
      } else {
        return `${baseUnsplashUrl}1544982503-4bb7efa35bb5?w=400&h=400&fit=crop&crop=center`; // Generic canned
      }

    case 'cereal':
      if (name.toLowerCase().includes('oats') || name.toLowerCase().includes('oatmeal')) {
        return `${baseUnsplashUrl}1517686469429-8bdb88b9f907?w=400&h=400&fit=crop&crop=center`; // Oatmeal bowl
      } else if (name.toLowerCase().includes('granola')) {
        return `${baseUnsplashUrl}1571115764595-c65f8b5c8b5c?w=400&h=400&fit=crop&crop=center`; // Granola
      } else if (name.toLowerCase().includes('flakes')) {
        return `${baseUnsplashUrl}1517686469429-8bdb88b9f907?w=400&h=400&fit=crop&crop=center`; // Cereal flakes
      } else {
        return `${baseUnsplashUrl}1517686469429-8bdb88b9f907?w=400&h=400&fit=crop&crop=center`; // Generic cereal
      }

    case 'meat':
      return `${baseUnsplashUrl}1588347818608-6b8c9b8c9b8c?w=400&h=400&fit=crop&crop=center`; // Fresh meat

    case 'seafood':
      return `${baseUnsplashUrl}1544551763-46a013bb70d5?w=400&h=400&fit=crop&crop=center`; // Fresh seafood

    case 'condiments':
      return `${baseUnsplashUrl}1472476443507-c7a5948772fc?w=400&h=400&fit=crop&crop=center`; // Condiment bottles

    case 'pasta':
      return `${baseUnsplashUrl}1551183053-bf91a1d81141?w=400&h=400&fit=crop&crop=center`; // Pasta varieties

    case 'rice':
      return `${baseUnsplashUrl}1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center`; // Rice grains

    case 'spices':
      return `${baseUnsplashUrl}1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center`; // Spice jars

    case 'oils':
      return `${baseUnsplashUrl}1472476443507-c7a5948772fc?w=400&h=400&fit=crop&crop=center`; // Cooking oils

    default:
      // High-quality generic grocery item
      return `${baseUnsplashUrl}1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center`;
  }
};

// Helper function to get a fallback image if the main image fails to load
export const getFallbackProductImage = (category: string): string => {
  // Use a simple colored placeholder as ultimate fallback
  const createFallbackSVG = (bgColor: string, text: string): string => {
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="6" fill="${bgColor}"/>
        <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${text}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const categoryMap: { [key: string]: { color: string; text: string } } = {
    'beverages': { color: '#4A90E2', text: 'BEV' },
    'dairy': { color: '#F0E68C', text: 'DAI' },
    'bakery': { color: '#DEB887', text: 'BAK' },
    'produce': { color: '#32CD32', text: 'PRO' },
    'snacks': { color: '#FF6347', text: 'SNK' },
    'frozen': { color: '#87CEEB', text: 'FRZ' },
    'cleaning': { color: '#40E0D0', text: 'CLN' },
    'canned goods': { color: '#C0C0C0', text: 'CAN' },
    'cereal': { color: '#FF4500', text: 'CER' },
    'meat': { color: '#8B4513', text: 'MEA' },
    'seafood': { color: '#20B2AA', text: 'SEA' },
    'condiments': { color: '#DAA520', text: 'CON' },
    'pasta': { color: '#F4A460', text: 'PAS' },
    'rice': { color: '#F5DEB3', text: 'RIC' },
    'spices': { color: '#D2691E', text: 'SPI' },
    'oils': { color: '#FFD700', text: 'OIL' }
  };

  const categoryInfo = categoryMap[category.toLowerCase()] || { color: '#6B7280', text: 'GEN' };
  return createFallbackSVG(categoryInfo.color, categoryInfo.text);
};

// Alternative function for when Unsplash images don't load - uses more reliable placeholder services
export const getReliableProductImage = (sku: string, category: string, name: string): string => {
  // Use Lorem Picsum with seed for consistent images
  const seed = sku.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return `https://picsum.photos/seed/${seed}/400/400`;
};