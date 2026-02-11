const nodemailer = require('nodemailer');
const axios = require('axios'); // Add axios to make HTTP requests

// Create a reusable transporter using Ethereal
let transporter;
async function getTransporter() {
  if (transporter) return transporter;

  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  console.log('Ethereal test account:', testAccount);
  return transporter;
}

// Account approval email (unchanged)
async function sendApprovalEmail(toEmail, username) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: '"Auction App" <no-reply@auctionapp.com>',
    to: toEmail,
    subject: 'Account Approved',
    text: `Hello ${username}, your account has been approved! You can now log in.`,
    html: `<p>Hello <strong>${username}</strong>, your account has been approved! You can now log in.</p>`
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

// Updated winner email — no longer initiates payment directly (user does that from the frontend)
async function sendWinnerEmail(toEmail, username, itemTitle, finalPrice) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: '"Auction App" <no-reply@auctionapp.com>',
    to: toEmail,
    subject: `Congratulations! You won ${itemTitle}`,
    text: `Hi ${username}, you are the winner of the auction for "${itemTitle}" with a bid of $${finalPrice}. Log in to complete your payment.`,
    html: `<p>Hi <strong>${username}</strong>,</p>
           <p>You are the winner of the auction for "<strong>${itemTitle}</strong>" with a bid of <strong>$${finalPrice}</strong>.</p>
           <p>Log in to your account to complete your payment.</p>`
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = { sendApprovalEmail, sendWinnerEmail };
