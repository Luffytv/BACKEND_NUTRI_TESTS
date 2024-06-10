const nodemailer = require('nodemailer');
const db = require('./database');

const sendNotification = async (userId) => {
  // Obtener los datos del usuario de la base de datos
  const userData = await db.getUserData(userId);

  // Configurar el correo electrónico
  const mailOptions = {
    from: 'tumail@gmail.com',
    to: userData.email,
    subject: 'Asunto del correo',
    text: 'Cuerpo del correo',
    attachments: [
      {
        filename: 'archivo_adjunto.txt',
        content: 'Contenido del archivo adjunto',
      },
    ],
  };

  // Configurar el transportador de correo usando nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    },
  });

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
};

module.exports = sendNotification;
