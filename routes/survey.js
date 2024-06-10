const express = require('express');
const router = express.Router();
const SurveyResponse = require('../models/SurveyResponse');
const observer = require('../observer');
const sendNotification = require('../mailer');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

// Registrar el observador para notificación por correo electrónico
observer.subscribe(async (count) => {
    if (count === 50) {
        try {
            const responses = await SurveyResponse.find();

            // Transformar los datos al formato solicitado
            let csvData = [];

            responses.forEach(response => {
                csvData.push({ variable: 'id', value: response._id });
                csvData.push({ variable: 'age', value: response.age });
                csvData.push({ variable: 'generalFlavor', value: response.generalFlavor });
                csvData.push({ variable: 'chocolateAroma', value: response.chocolateAroma });
                csvData.push({ variable: 'mouthTexture', value: response.mouthTexture });
                csvData.push({ variable: 'cookieColor', value: response.cookieColor });
                csvData.push({ variable: 'generalSatisfaction', value: response.generalSatisfaction });
                csvData.push({ variable: 'sweetnessIntensity', value: response.sweetnessIntensity });
                csvData.push({ variable: 'chocolateAromaIntensity', value: response.chocolateAromaIntensity });
                csvData.push({ variable: 'softTexture', value: response.softTexture });
                csvData.push({ variable: 'satietyLevel', value: response.satietyLevel });
                csvData.push({ variable: 'perceivedSize', value: response.perceivedSize });
                csvData.push({ variable: '', value: '' }); // Agregar una línea en blanco para separar usuarios
            });

            // Configurar las opciones de json2csv
            const fields = ['variable', 'value'];
            const opts = { fields };
            const parser = new Parser(opts);
            const csv = parser.parse(csvData);

            // Guardar el archivo CSV temporalmente
            const csvPath = path.join(__dirname, '../survey_responses.csv');
            fs.writeFileSync(csvPath, csv);

// Enviar la notificación con el archivo adjunto
sendNotification('Hito de Respuestas de Encuesta', 'Ahora hay 50 respuestas de encuesta.', csv);

            // Eliminar el archivo CSV temporal después de enviarlo
            fs.unlinkSync(csvPath);
        } catch (error) {
            console.error('Error al generar y enviar el CSV:', error);
        }
    }
});

router.post('/', async (req, res) => {
    try {
        const newResponse = new SurveyResponse(req.body); // Crear una nueva respuesta de encuesta
        await newResponse.save(); // Guardar la nueva respuesta en la base de datos

        // Verificar la cantidad de respuestas después de guardar la nueva respuesta
        const responseCount = await SurveyResponse.countDocuments();
        observer.notify(responseCount); // Notificar a los observadores sobre el nuevo conteo

        res.status(201).json(newResponse); // Responder con la nueva respuesta guardada
    } catch (error) {
        res.status(400).json({ message: error.message }); // Responder con error si algo falla
    }
});

router.get('/', async (req, res) => {
    try {
        const responses = await SurveyResponse.find();
        res.status(200).json(responses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        await SurveyResponse.deleteMany({});
        res.status(200).json({ message: 'Todos los formularios han sido eliminados correctamente.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar un formulario por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await SurveyResponse.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({ message: 'No se encontró el formulario para eliminar.' });
        }
        res.status(200).json({ message: 'Formulario eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/average', async (req, res) => {
    try {
        const responses = await SurveyResponse.find();
        if (responses.length === 0) {
            return res.status(404).json({ message: 'No hay respuestas para calcular el promedio.' });
        }

        // Inicializar contadores para cada campo
        let ageSum = 0;
        let generalFlavorSum = 0;
        let chocolateAromaSum = 0;
        let mouthTextureSum = 0;
        let cookieColorSum = 0;
        let generalSatisfactionSum = 0;
        let sweetnessIntensitySum = 0;
        let chocolateAromaIntensitySum = 0;
        let softTextureSum = 0;
        let satietyLevelSum = 0;
        let perceivedSizeSum = 0;

        // Sumar los valores de cada campo en todas las respuestas
        for (const response of responses) {
            ageSum += Number(response.age);
            generalFlavorSum += Number(response.generalFlavor);
            chocolateAromaSum += Number(response.chocolateAroma);
            mouthTextureSum += Number(response.mouthTexture);
            cookieColorSum += Number(response.cookieColor);
            generalSatisfactionSum += Number(response.generalSatisfaction);
            sweetnessIntensitySum += Number(response.sweetnessIntensity);
            chocolateAromaIntensitySum += Number(response.chocolateAromaIntensity);
            softTextureSum += Number(response.softTexture);
            satietyLevelSum += Number(response.satietyLevel);
            perceivedSizeSum += Number(response.perceivedSize);
        }

        // Calcular el promedio de cada campo
        const totalCount = responses.length;
        const averageAge = ageSum / totalCount;
        const averageGeneralFlavor = generalFlavorSum / totalCount;
        const averageChocolateAroma = chocolateAromaSum / totalCount;
        const averageMouthTexture = mouthTextureSum / totalCount;
        const averageCookieColor = cookieColorSum / totalCount;
        const averageGeneralSatisfaction = generalSatisfactionSum / totalCount;
        const averageSweetnessIntensity = sweetnessIntensitySum / totalCount;
        const averageChocolateAromaIntensity = chocolateAromaIntensitySum / totalCount;
        const averageSoftTexture = softTextureSum / totalCount;
        const averageSatietyLevel = satietyLevelSum / totalCount;
        const averagePerceivedSize = perceivedSizeSum / totalCount;

        // Enviar el promedio como respuesta
        res.status(200).json({
            averageAge,
            averageGeneralFlavor,
            averageChocolateAroma,
            averageMouthTexture,
            averageCookieColor,
            averageGeneralSatisfaction,
            averageSweetnessIntensity,
            averageChocolateAromaIntensity,
            averageSoftTexture,
            averageSatietyLevel,
            averagePerceivedSize
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/download/csv', async (req, res) => {
    try {
        const responses = await SurveyResponse.find();

        // Transformar los datos al formato solicitado
        let csvData = [];

        responses.forEach(response => {
            csvData.push({ variable: 'id', value: response._id });
            csvData.push({ variable: 'age', value: response.age });
            csvData.push({ variable: 'generalFlavor', value: response.generalFlavor });
            csvData.push({ variable: 'chocolateAroma', value: response.chocolateAroma });
            csvData.push({ variable: 'mouthTexture', value: response.mouthTexture });
            csvData.push({ variable: 'cookieColor', value: response.cookieColor });
            csvData.push({ variable: 'generalSatisfaction', value: response.generalSatisfaction });
            csvData.push({ variable: 'sweetnessIntensity', value: response.sweetnessIntensity });
            csvData.push({ variable: 'chocolateAromaIntensity', value: response.chocolateAromaIntensity });
            csvData.push({ variable: 'softTexture', value: response.softTexture });
            csvData.push({ variable: 'satietyLevel', value: response.satietyLevel });
            csvData.push({ variable: 'perceivedSize', value: response.perceivedSize });
            csvData.push({ variable: '', value: '' }); // Agregar una línea en blanco para separar usuarios
        });

        // Configurar las opciones de json2csv
        const fields = ['variable', 'value'];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(csvData);

        res.header('Content-Type', 'text/csv');
        res.attachment('survey_responses.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
