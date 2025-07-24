import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    console.log("MAIL_USER:", process.env.MAIL_USER);
    console.log("MAIL_PASS:", process.env.MAIL_PASSWORD ? "Loaded" : "Missing");

    const info = await transporter.sendMail({
      from: `"POS Bootcamp" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("Email Sent: ", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
