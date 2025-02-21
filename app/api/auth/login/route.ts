import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User'; // Still use the model to query the `users` collection

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    console.log('User found:', user);
    console.log('Plain-text password:', password);
    console.log('Hashed password:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1h',
    });

    return new Response(JSON.stringify({ token, role: user.role }), { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
