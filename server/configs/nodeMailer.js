import nodemailer from 'nodemailer'

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail service
    auth: {
        user: process.env.SMTP_USER, // Your Gmail email
        pass: process.env.SMTP_PASS, // Your Gmail App Password (16 character)
    },
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Gmail SMTP connection error:', error.message);
    } else {
        console.log('✅ Gmail SMTP server is ready to send emails');
    }
});

// Export the transporter for use in booking controllers
export default transporter;