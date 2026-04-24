import nodemailer from "nodemailer";

import { env } from "../config/env.js";

const hasSmtpConfig = Boolean(env.mail.host && env.mail.user && env.mail.pass);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.port === 465,
      auth: {
        user: env.mail.user,
        pass: env.mail.pass
      }
    })
  : nodemailer.createTransport({
      jsonTransport: true
    });

export const mailService = {
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const info = await transporter.sendMail({
      from: env.mail.from,
      to: email,
      subject: "Reset your password",
      text: `Reset your password using this link: ${resetLink}`,
      html: `<p>Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
    });

    if (!hasSmtpConfig) {
      console.log("SMTP is not configured. Reset email payload:", JSON.stringify(info));
    }
  }
};
