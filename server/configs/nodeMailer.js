import nodemailer from 'nodemailer'

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // SMTP host for Brevo [5]
    port: 587, // Standard SMTP port [5]
    auth: {
        user: process.env.SMTP_USER, // SMTP username from environment variables [6]
        pass: process.env.SMTP_PASS, // SMTP password from environment variables [6]
    },
});

// Export the transporter for use in booking controllers [1], [3]
export default transporter;