const nodemailer = require('nodemailer'); // On importe Nodemailer pour envoyer des emails.

const sendResetEmail = async (userEmail, resetUrl) => {
  // Création d'un transporteur pour envoyer les emails , iCloud.
  const transporter = nodemailer.createTransport({
    service: 'icloud',  
    auth: {
      user: process.env.EMAIL_USER,  // L'adresse email utilisée pour l'envoi, récupérée depuis les variables d'environnement.
      pass: process.env.EMAIL_PASS,  // Le mot de passe associé à cette adresse email, également récupéré des variables d'environnement.
    },
    tls: {
      rejectUnauthorized: false,  // Ajout de cette option pour ignorer les erreurs de certificat auto-signé.
    },
  });

  // Configuration de l'email à envoyer.
  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: userEmail,  
    subject: 'Lien de réinitialisation de mot de passe',  
    text: `Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :\n\n${resetUrl}`,  
  };

  // Envoi de l'email avec les options configurées.
  return transporter.sendMail(mailOptions); 
};

module.exports = { sendResetEmail }; 