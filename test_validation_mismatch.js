// Test validation differences between frontend and backend
const API_BASE_URL = 'http://localhost:8000/api';

async function testPasswordValidation() {
    console.log('Testing password validation edge cases...');
    
    // Test case 1: Password with special characters (should work on both)
    const testData1 = {
        email: 'validation.test1@example.com',
        password: 'pass@123',
        name: 'Validation Test 1',
        role: 'associate',
        store_id: 'store-val1',
        store_name: 'Validation Store 1'
    };
    
    console.log('\nTest 1 - Password with special chars:', testData1.password);
    await testRegistration(testData1);
    
    // Test case 2: Password with only letters and numbers (should work)
    const testData2 = {
        email: 'validation.test2@example.com',
        password: 'pass123',
        name: 'Validation Test 2',
        role: 'manager',
        store_id: 'store-val2',
        store_name: 'Validation Store 2'
    };
    
    console.log('\nTest 2 - Password with letters and numbers only:', testData2.password);
    await testRegistration(testData2);
    
    // Test case 3: Password too short (should fail)
    const testData3 = {
        email: 'validation.test3@example.com',
        password: 'p1',
        name: 'Validation Test 3',
        role: 'associate',
        store_id: 'store-val3',
        store_name: 'Validation Store 3'
    };
    
    console.log('\nTest 3 - Password too short:', testData3.password);
    await testRegistration(testData3);
    
    // Test case 4: Password without numbers (should fail)
    const testData4 = {
        email: 'validation.test4@example.com',
        password: 'password',
        name: 'Validation Test 4',
        role: 'manager',
        store_id: 'store-val4',
        store_name: 'Validation Store 4'
    };
    
    console.log('\nTest 4 - Password without numbers:', testData4.password);
    await testRegistration(testData4);
    
    // Test case 5: Password without letters (should fail)
    const testData5 = {
        email: 'validation.test5@example.com',
        password: '123456',
        name: 'Validation Test 5',
        role: 'associate',
        store_id: 'store-val5',
        store_name: 'Validation Store 5'
    };
    
    console.log('\nTest 5 - Password without letters:', testData5.password);
    await testRegistration(testData5);
}

async function testRegistration(testData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error response:', errorData);
        } else {
            const responseData = await response.json();
            console.log('Success - User created:', responseData.user.id);
        }
        
    } catch (error) {
        console.error('Request error:', error);
    }
}

// Test empty/invalid fields
async function testFieldValidation() {
    console.log('\n\nTesting field validation...');
    
    // Test case: Empty store_id
    const testData = {
        email: 'field.test@example.com',
        password: 'password123',
        name: 'Field Test',
        role: 'associate',
        store_id: '',  // Empty store_id
        store_name: 'Field Test Store'
    };
    
    console.log('\nTest - Empty store_id');
    await testRegistration(testData);
    
    // Test case: Empty store_name
    const testData2 = {
        email: 'field.test2@example.com',
        password: 'password123',
        name: 'Field Test 2',
        role: 'manager',
        store_id: 'store-field2',
        store_name: ''  // Empty store_name
    };
    
    console.log('\nTest - Empty store_name');
    await testRegistration(testData2);
}

// Run tests
testPasswordValidation().then(() => testFieldValidation());