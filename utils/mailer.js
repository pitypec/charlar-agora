import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const transport = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = (from, to, subject, html) => {
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) reject(err);

      resolve(info);
    });
  });
};

export const htmlMail = (url, txt) => {
  return `
<div style="max-width: 700px; margin: auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 14px; ">
  <h2 style="text-align: center; text-transform: uppercase; color: teal;" > Please confirm your email address by clicking the link below.</h2>
  <p>Congratulations! you're set to start using Joyous.
     Just click the button below to validate your email address.
  <p>
  <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
  <div>
    ${url}
  </div>
</div>
`;
};
