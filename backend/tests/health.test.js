const request = require('supertest');
const express = require('express');

// Create a minimal test app
const app = express();
app.use(express.json());

// Health check route for testing
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'WebCraft Studio API is running',
        version: '1.0.0'
    });
});

describe('Health Check API', () => {
    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const res = await request(app)
                .get('/api/health')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('WebCraft Studio API is running');
            expect(res.body.version).toBeDefined();
        });
    });
});
