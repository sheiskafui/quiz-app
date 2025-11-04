import nodemailer from 'nodemailer';


const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const url = `http://localhost:3000/api/auth/verify/${token}`;
    await transporter.sendMail({
        to: email,
        subject: 'Verify your email',
        html: `Click <a href="${url}">here</a> to verify your email.`,
    });
};


export { sendVerificationEmail };