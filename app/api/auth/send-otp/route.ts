import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  const normalizedEmail = email.toLowerCase();
  await dbConnect();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: normalizedEmail,
    subject: 'Your Luntiang-Kamay OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'OTP sent to email' }), { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return new Response(JSON.stringify({ message: 'Failed to send OTP' }), { status: 500 });
  }
}
