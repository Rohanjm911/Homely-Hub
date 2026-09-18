import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

export const sendEmail = async (options) => {
  // Configure mailgen template generator
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'HomelyHub',
      link: process.env.CLIENT_URL || 'http://localhost:5173',
      logo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&auto=format&fit=crop&q=80',
    },
  });

  // Generate email body using Mailgen
  const emailContent = {
    body: {
      name: options.name || 'HomelyHub Guest',
      intro: options.intro || 'You have received this email because a password reset request for your account was received.',
      action: {
        instructions: 'Click the button below to reset your password. This link is only valid for 10 minutes:',
        button: {
          color: '#0284c7',
          text: 'Reset Password',
          link: options.resetUrl,
        },
      },
      outro: 'If you did not request a password reset, no further action is required on your part.',
    },
  };

  const emailHtml = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  // If SMTP is not configured in env, log to console and simulate successful delivery
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('\n=================== 📧 PASSWORD RESET EMAIL SIMULATOR ===================');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Reset URL: ${options.resetUrl}`);
    console.log('=========================================================================\n');
    return { success: true, simulated: true };
  }

  // Create transporter with provided SMTP options
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'HomelyHub Support'} <${process.env.FROM_EMAIL || 'support@homelyhub.com'}>`,
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  await transporter.sendMail(message);
  return { success: true };
};
