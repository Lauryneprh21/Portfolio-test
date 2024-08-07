const nodemailer = require('nodemailer');

const sendResetEmail = async (userEmail, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: 'icloud',  
    auth: {
      user: process.env.EMAIL_USER,  
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Lien de réinitialisation de mot de passe',
    text: `Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :\n\n${resetUrl}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
