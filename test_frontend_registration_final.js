// Final test to verify frontend registration works after CORS fix
const API_BASE_URL = 'http://localhost:8000/api';

async function testCompleteRegistrationFlow() {
    console.log('=== Testing Complete Registration Flow ===');
    
    // Test data
    const testUser = {
        email: `frontend-test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Frontend Test User',
        role: 'associate',
        store_id: 'store-frontend-001',
        store_name: 'Frontend Test Store'
    };
    
    console.log('Test user data:', testUser);
    
    try {
        // Step 1: Test OPTIONS preflight request
        console.log('\n1. Testing OPTIONS preflight request...');
        const optionsResponse = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:5137',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type',
            },
        });
        
        console.log('OPTIONS Status:', optionsResponse.status);
        console.log('OPTIONS Headers:', Object.fromEntries(optionsResponse.headers.entries()));
        
        if (!optionsResponse.ok) {
            throw new Error(`OPTIONS request failed with status ${optionsResponse.status}`);
        }
        
        // Step 2: Test actual registration
        console.log('\n2. Testing registration request...');
        const registrationResponse = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5137',
            },
            body: JSON.stringify(testUser),
        });
        
        console.log('Registration Status:', registrationResponse.status);
        console.log('Registration Headers:', Object.fromEntries(registrationResponse.headers.entries()));
        
        if (!registrationResponse.ok) {
            const errorData = await registrationResponse.json();
            throw new Error(`Registration failed: ${errorData.detail || 'Unknown error'}`);
        }
        
        const registrationData = await registrationResponse.json();
        console.log('Registration Success:', {
            message: registrationData.message,
            user_id: registrationData.user.id,
            user_email: registrationData.user.email,
            user_role: registrationData.user.role,
            token_provided: !!registrationData.access_token
        });
        
        // Step 3: Test login with the created user
        console.log('\n3. Testing login with created user...');
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5137',
            },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password,
                role: testUser.role
            }),
        });
        
        if (!loginResponse.ok) {
            const errorData = await loginResponse.json();
            throw new Error(`Login failed: ${errorData.detail || 'Unknown error'}`);
        }
        
        const loginData = await loginResponse.json();
        console.log('Login Success:', {
            user_id: loginData.user.id,
            user_email: loginData.user.email,
            token_provided: !!loginData.access_token
        });
        
        console.log('\n✅ ALL TESTS PASSED!');
        console.log('🎉 User creation and authentication are working correctly after CORS fix!');
        
        return true;
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        return false;
    }
}

// Run the test
testCompleteRegistrationFlow().then(success => {
    if (success) {
        console.log('\n🚀 The deployment issue has been resolved!');
        console.log('Users can now successfully create accounts and log in.');
    } else {
        console.log('\n⚠️  There may still be issues that need to be addressed.');
    }
});