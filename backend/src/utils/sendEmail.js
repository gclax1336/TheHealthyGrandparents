const nodemailer = require('nodemailer');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

const ses = new SESv2Client({ region: 'us-east-2' });

const transporter = nodemailer.createTransport({
  ses: { // lowercase 'ses' is required for SESv2
    client: ses,
    aws: { SendEmailCommand }
  }
});

async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: 'noreply@thehealthygrandparent.com', // Use your verified sender
      to,
      subject,
      html,
    });
    console.log('Email sent to:', to);
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}

module.exports = sendEmail; 