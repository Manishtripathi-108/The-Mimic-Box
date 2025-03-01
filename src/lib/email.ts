import nodemailer from 'nodemailer';

const mailConfig =
    process.env.NODE_ENV === 'production'
        ? {
              host: 'smtp.forwardemail.net',
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
