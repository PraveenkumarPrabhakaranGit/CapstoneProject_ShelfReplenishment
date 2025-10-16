// Test script to verify CORS fix for registration
const API_BASE_URL = 'http://localhost:8000/api';

async function testRegistration() {
    console.log('Testing registration endpoint...');
    
    const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
        role: 'associate',
        store_id: 'store-001',
        store_name: 'Test Store'
    };
    
    try {
        console.log('Sending registration request...');
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser),
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log('Registration successful:', data);
            return true;
        } else {
            const errorData = await response.json();
            console.log('Registration failed:', errorData);
            return false;
        }
    } catch (error) {
        console.error('Network error:', error.message);
        return false;
    }
}

async function testOptionsRequest() {
    console.log('Testing OPTIONS preflight request...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:5137',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type',
            },
        });
        
        console.log('OPTIONS response status:', response.status);
        console.log('OPTIONS response headers:', Object.fromEntries(response.headers.entries()));
        
        return response.ok;
    } catch (error) {
        console.error('OPTIONS request failed:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('=== CORS Fix Test ===');
    
    const optionsResult = await testOptionsRequest();
    console.log('OPTIONS test result:', optionsResult ? 'PASS' : 'FAIL');
    
    const registrationResult = await testRegistration();
    console.log('Registration test result:', registrationResult ? 'PASS' : 'FAIL');
    
    if (optionsResult && registrationResult) {
        console.log('✅ All tests passed! CORS issue is fixed.');
    } else {
        console.log('❌ Some tests failed. CORS issue may still exist.');
    }
}

// Run the tests
runTests();