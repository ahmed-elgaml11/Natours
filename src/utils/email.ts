import nodemailer from 'nodemailer'

interface options {
    email: string,
    subject: string,
    message: string,

}

export const sendEmail = async (options: options) => {
    // 1- create transporter: object responsible for sending emails. It contains the configuration details that tell Nodemailer how to connect to an email service provider'smtp'
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })


    //2- define the email options
    const mailOptions = {
        from: 'Natours <ahmed@email.com>', 
        to: options.email,                        
        subject: options.subject,                 
        text: options.message,                    
        html: `<p>${options.message}</p>`        
    };

    //3- send the emails
    await transporter.sendMail(mailOptions)


}