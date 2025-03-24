import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  otp: { type: String, default: null },
}, { timestamps: true });

const User = models.User || model('User', UserSchema, 'users');

export default User;
