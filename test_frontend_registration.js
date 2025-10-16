// Test script to simulate frontend registration
const API_BASE_URL = 'http://localhost:8000/api';

async function testRegistration() {
    console.log('Testing frontend registration...');
    
    const testData = {
        email: 'test.associate@example.com',
        password: 'password123',
        name: 'Test Associate',
        role: 'associate',
        store_id: 'store-001',
        store_name: 'Test Store'
    };
    
    console.log('Sending registration data:', testData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error response:', errorData);
            throw new Error(errorData.detail || 'Registration failed');
        }
        
        const responseData = await response.json();
        console.log('Success response:', responseData);
        
    } catch (error) {
        console.error('Registration error:', error);
    }
}

// Test with manager role as well
async function testManagerRegistration() {
    console.log('\nTesting manager registration...');
    
    const testData = {
        email: 'test.manager@example.com',
        password: 'password123',
        name: 'Test Manager',
        role: 'manager',
        store_id: 'store-002',
        store_name: 'Test Store 2'
    };
    
    console.log('Sending manager registration data:', testData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error response:', errorData);
            throw new Error(errorData.detail || 'Registration failed');
        }
        
        const responseData = await response.json();
        console.log('Success response:', responseData);
        
    } catch (error) {
        console.error('Manager registration error:', error);
    }
}

// Run tests
testRegistration().then(() => testManagerRegistration());