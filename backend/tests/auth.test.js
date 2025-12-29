const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock database
const mockDb = {
    users: [],
    query: jest.fn()
};

// Mock the database module
jest.mock('../config/database', () => ({
    query: (...args) => mockDb.query(...args)
}));

// Create test app with auth routes
const app = express();
app.use(express.json());

// Import auth routes after mocking
const authRoutes = require('../routes/auth');
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockDb.users = [];
    });

    describe('POST /api/auth/register', () => {
        it('should validate required fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({})
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.errors).toBeDefined();
        });

        it('should validate email format', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'password123',
                    fullName: 'Test User'
                })
                .expect(400);

            expect(res.body.success).toBe(false);
        });

        it('should validate password length', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: '12345', // Too short
                    fullName: 'Test User'
                })
                .expect(400);

            expect(res.body.success).toBe(false);
        });

        it('should register a new user successfully', async () => {
            // Mock: Check if user exists (return empty)
            mockDb.query.mockResolvedValueOnce({ rows: [] });
            // Mock: Insert user
            mockDb.query.mockResolvedValueOnce({
                rows: [{
                    id: 'test-uuid',
                    email: 'test@example.com',
                    full_name: 'Test User',
                    credits: 500
                }]
            });
            // Mock: Insert transaction
            mockDb.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    fullName: 'Test User'
                })
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.token).toBeDefined();
        });

        it('should reject duplicate email', async () => {
            // Mock: Check if user exists (return existing user)
            mockDb.query.mockResolvedValueOnce({
                rows: [{ id: 'existing-user' }]
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'existing@example.com',
                    password: 'password123',
                    fullName: 'Test User'
                })
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('zaten kayıtlı');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should validate required fields', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({})
                .expect(400);

            expect(res.body.success).toBe(false);
        });

        it('should reject invalid credentials', async () => {
            // Mock: User not found
            mockDb.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                })
                .expect(401);

            expect(res.body.success).toBe(false);
        });

        it('should login with valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);

            // Mock: Find user
            mockDb.query.mockResolvedValueOnce({
                rows: [{
                    id: 'test-uuid',
                    email: 'test@example.com',
                    password_hash: hashedPassword,
                    full_name: 'Test User',
                    credits: 500,
                    role: 'user',
                    avatar_url: null
                }]
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
            expect(res.body.data.user.email).toBe('test@example.com');
        });
    });
});
