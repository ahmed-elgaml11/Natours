import nodemailer from 'nodemailer'
import path from 'path'
import { renderFile } from 'ejs'
import { IUser } from '../api/users/user.model'

interface options {
    email: string,
    subject: string,
    message: string,

}


export class Email {
    public url: string;
    public to: string
    public from: string
    public firstName: string
    constructor(user: IUser, url: string) {
        this.to = user.email
        this.from = `${process.env.EMAIL_FROM}`
        this.url = url
        this.firstName = user.name.split(' ')[0]
    }
// 1- create transporter: object responsible for sending emails. It contains the configuration details that tell Nodemailer how to connect to an email service provider'smtp'

    newTransport() {
        // if (process.env.NODE_ENV == 'production') {
        //     return nodemailer.createTransport({
        //         service: 'SendGrid',
        //         auth: {
        //             user: process.env.SENDGRID_USERNAME,
        //             pass: process.env.SENDGRID_PASSWORD
        //         }
        //     });
        // }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })

    }

    async send(template: string, subject: string) {

        const html = await renderFile(
            path.join(__dirname, '../views/emails', `${template}.ejs`),
            {
                firstName: this.firstName,
                url: this.url,
                subject: subject
            }
        );
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html
        };

        try {
            await this.newTransport().sendMail(mailOptions);
        } catch (error) {
            throw new Error(`Failed to send email: ${error}`);
        }
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome To The Natours World')
    }
    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
    }


}

