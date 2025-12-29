const request = require('supertest');
const express = require('express');

// Mock database
const mockDb = {
    query: jest.fn()
};

// Mock the database module
jest.mock('../config/database', () => ({
    query: (...args) => mockDb.query(...args)
}));

// Mock auth middleware
jest.mock('../middleware/auth', () => ({
    authenticateToken: (req, res, next) => {
        req.user = { id: 'test-user-id' };
        next();
    },
    generateToken: () => 'mock-token'
}));

// Create test app
const app = express();
app.use(express.json());

const projectRoutes = require('../routes/projects');
app.use('/api/projects', projectRoutes);

describe('Projects API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/projects', () => {
        it('should return user projects', async () => {
            mockDb.query.mockResolvedValueOnce({
                rows: [
                    {
                        id: 'project-1',
                        name: 'Test Project',
                        status: 'draft',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]
            });

            const res = await request(app)
                .get('/api/projects')
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].name).toBe('Test Project');
        });

        it('should return empty array when no projects', async () => {
            mockDb.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/projects')
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(0);
        });
    });

    describe('POST /api/projects', () => {
        it('should create a new project', async () => {
            mockDb.query.mockResolvedValueOnce({
                rows: [{
                    id: 'new-project-id',
                    user_id: 'test-user-id',
                    name: 'New Project',
                    content: { components: [] },
                    status: 'draft',
                    created_at: new Date().toISOString()
                }]
            });

            const res = await request(app)
                .post('/api/projects')
                .send({ name: 'New Project' })
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('New Project');
        });

        it('should validate project name', async () => {
            const res = await request(app)
                .post('/api/projects')
                .send({ name: '' })
                .expect(400);

            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/projects/:id', () => {
        it('should delete a project', async () => {
            mockDb.query.mockResolvedValueOnce({
                rows: [{ id: 'project-id' }]
            });

            const res = await request(app)
                .delete('/api/projects/project-id')
                .expect(200);

            expect(res.body.success).toBe(true);
        });

        it('should return 404 for non-existent project', async () => {
            mockDb.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .delete('/api/projects/non-existent')
                .expect(404);

            expect(res.body.success).toBe(false);
        });
    });
});
