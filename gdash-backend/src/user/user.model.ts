import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  deleted: { type: Boolean, required: false, default: false },
  admin: { type: Boolean, required: false, default: false },
  refreshToken: { type: String, default: null },
});

export interface User extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  password: string;
}
