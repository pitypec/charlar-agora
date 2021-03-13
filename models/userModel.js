import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
      unique: true,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  role: {
    type: Number,
    default: 0
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  }
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.method !== 'local') {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.local.password, salt);
    this.local.password = hashedPassword;
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('user', UserSchema);

export default User;
