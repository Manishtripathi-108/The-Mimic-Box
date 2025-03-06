import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import React from 'react';

const EMAIL_SENDER = 'The Mimic Box <noreply@themimicbox.com>';

const mailConfig =
    process.env.NODE_ENV !== 'production'
        ? {
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
              },
          }
        : {
              host: 'smtp.ethereal.email',
              port: 587,
              auth: {
                  user: process.env.ETHEREAL_USER,
                  pass: process.env.ETHEREAL_PASS,
              },
          };

export const transporter = nodemailer.createTransport(mailConfig);

export const sendEmail = async (to: string, subject: string, emailComponent: React.ReactElement) => {
    try {
        const html = await render(emailComponent);

        const response = await transporter.sendMail({ from: EMAIL_SENDER, to, subject, html });
        if (!response) throw new Error('Email sending failed');
        return { success: true };
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return { success: false, message: 'Failed to send email.' };
    }
};
