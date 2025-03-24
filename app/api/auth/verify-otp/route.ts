import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return new Response(JSON.stringify({ message: 'Email and OTP are required' }), { status: 400 });
  }

  const normalizedEmail = email.toLowerCase();
  await dbConnect();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user || user.otp !== otp) {
    return new Response(JSON.stringify({ message: 'Invalid OTP' }), { status: 401 });
  }

  // Clear OTP from database
  user.otp = null;
  await user.save();

  return new Response(JSON.stringify({ message: 'OTP verified' }), { status: 200 });
}
