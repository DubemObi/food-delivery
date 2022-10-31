const nodemailer = require("nodemailer");

const newEmail = async (body) => {
  const mail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: body.email,
    subject: body.subject,
    text: JSON.stringify(body.text),
  };

  await mail.sendMail(mailOptions);
};

module.exports = newEmail;
