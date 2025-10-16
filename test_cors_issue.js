// Test CORS issue by simulating frontend request from browser
const API_BASE_URL = 'http://localhost:8000/api';

async function testCorsFromFrontend() {
    console.log('Testing CORS from frontend perspective...');
    
    const testData = {
        email: 'cors.test@example.com',
        password: 'password123',
        name: 'CORS Test User',
        role: 'associate',
        store_id: 'store-cors',
        store_name: 'CORS Test Store'
    };
    
    console.log('Sending request with Origin header simulation...');
    
    try {
        // Simulate request from frontend port 5137 (as configured in vite.config.ts)
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5137', // Simulate browser Origin header
            },
            body: JSON.stringify(testData),
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error response:', errorData);
        } else {
            const responseData = await response.json();
            console.log('Success response:', responseData);
        }
        
    } catch (error) {
        console.error('Request error:', error);
    }
}

async function testCorsFromWrongPort() {
    console.log('\nTesting CORS from wrong port (3000)...');
    
    const testData = {
        email: 'cors.wrong@example.com',
        password: 'password123',
        name: 'CORS Wrong Port Test',
        role: 'manager',
        store_id: 'store-wrong',
        store_name: 'Wrong Port Store'
    };
    
    try {
        // Simulate request from wrong port
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000', // Wrong port
            },
            body: JSON.stringify(testData),
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error response:', errorData);
        } else {
            const responseData = await response.json();
            console.log('Success response:', responseData);
        }
        
    } catch (error) {
        console.error('Request error:', error);
    }
}

// Run tests
testCorsFromFrontend().then(() => testCorsFromWrongPort());