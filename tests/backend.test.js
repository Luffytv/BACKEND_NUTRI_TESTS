const supertest = require('supertest');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Survey = require('../routes/survey');
const SurveyResponse = require('../models/SurveyResponse');


describe('Integration Tests', () => {
afterAll(async () => {
    // Cierra la conexión a la base de datos después de las pruebas
    await mongoose.disconnect();
});

test('GET /api/survey should return all surveys', async () => {
    // Crea una encuesta de ejemplo en la base de datos para verificar si se devuelve
    const sampleSurveyResponse = new SurveyResponse({
        age: 25,
        generalFlavor: 3,
        chocolateAroma: 4,
        mouthTexture: 5,
        cookieColor: 2,
        generalSatisfaction: 4,
        sweetnessIntensity: 3,
        chocolateAromaIntensity: 4,
        softTexture: 2,
        satietyLevel: 5,
        perceivedSize: 3
    });

    await sampleSurveyResponse.save();

    const response = await request(app).get('/api/survey');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0].age).toBe(25); // Ajusta los valores según tus requisitos
});

test('should create a new survey response', async () => {
    const newSurveyResponse = {
        // Define aquí los datos de la encuesta que deseas enviar
        age: 25,
        generalFlavor: 3,
        chocolateAroma: 4,
        mouthTexture: 5,
        cookieColor: 2,
        generalSatisfaction: 4,
        sweetnessIntensity: 3,
        chocolateAromaIntensity: 4,
        softTexture: 2,
        satietyLevel: 5,
        perceivedSize: 3
    };

    const response = await request(app)
        .post('/api/survey')
        .send(newSurveyResponse);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    });
});

