// import nodemailer from "nodemailer";


// const transporter = nodemailer.createTransport({
//   //host: "smtp.gmail.com",
//   service:"gmail",
//  // port: 465,
//  // secure: true,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// export const sendEmail = async (to, subject, message) => {
//   try {
//     // console.log("MAIL_USER:", process.env.MAIL_USER);
//     // console.log("MAIL_PASS:", process.env.MAIL_PASSWORD ? "Loaded" : "Missing");

//     const info = await transporter.sendMail({
//       from: `"POS Bootcamp" <${process.env.MAIL_USER}>`,
//       to,
//       subject,
//       html: message,
//     });
//     console.log("Email Sent: ", info.response);
//     return info
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async ({ to, subject, message }) => {
  try {
    const mailOptions = {
      from: env.EMAIL_USER,
      to,
      subject,
      html: message, // we use `html` for rich formatting
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent:", result.response);
    return result;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw new Error("Failed to send email");
  }
};
