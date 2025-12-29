// Test setup file
require('dotenv').config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.INITIAL_USER_CREDITS = '500';

// Increase timeout for database operations
jest.setTimeout(10000);

// Global beforeAll and afterAll hooks
beforeAll(async () => {
    // Setup code before all tests
});

afterAll(async () => {
    // Cleanup code after all tests
});
