const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Database connection', () => {
beforeAll(async () => {
    process.env.MONGO_URI = 'mongodb+srv://root:root@cluster0.1ofexvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Configuración de la URI de MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});

test('should connect to the database', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
});
});
