import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // If SMTP host is not configured, fallback to console logging for development
  if (!process.env.SMTP_HOST) {
    console.log('\n========================================================');
    console.log(' DEVELOPMENT MODE: SMTP credentials not found in .env');
    console.log('========================================================');
    console.log(` TO: ${options.email}`);
    console.log(` SUBJECT: ${options.subject}`);
    console.log(` MESSAGE:`);
    console.log(options.message);
    console.log('========================================================\n');
    return;
  }

  // Real SMTP integration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage || `<p>${options.message.replace(/\n/g, '<br>')}</p>`,
  };

  await transporter.sendMail(message);
};

export default sendEmail;
