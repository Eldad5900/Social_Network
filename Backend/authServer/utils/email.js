import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "fakelookproj@outlook.co.il",
      service: "hotmail",
      auth: {
        user: "fakelookproj@outlook.co.il",
        pass: "1qaz2wsx3edc",
      },
    });
    await transporter.sendMail({
      from: "fakelookproj@outlook.co.il",
      to: email,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.log(error);
  }
};
