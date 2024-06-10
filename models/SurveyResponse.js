const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
    age: { type: Number, required: true },
    generalFlavor: { type: Number, required: true },
    chocolateAroma: { type: Number, required: true },
    mouthTexture: { type: Number, required: true },
    cookieColor: { type: Number, required: true },
    generalSatisfaction: { type: Number, required: true },
    sweetnessIntensity: { type: Number, required: true },
    chocolateAromaIntensity: { type: Number, required: true },
    softTexture: { type: Number, required: true },
    satietyLevel: { type: Number, required: true },
    perceivedSize: { type: Number, required: true }
}, { timestamps: true });

const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);

module.exports = SurveyResponse;
