const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (to, subject, text) => {
    try {


      const transporter = nodemailer.createTransport({
        service: "Gmail", 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: `"Support Team" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
      };
  
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully!");
    } catch (error) {
      console.error("❌ Email sending failed:", error.message);
    }
  };





module.exports = sendEmail;
