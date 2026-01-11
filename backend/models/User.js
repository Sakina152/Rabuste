import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values for backward compatibility
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: function() {
        return !this.firebaseUid; // Phone number required only if not using Firebase
      },
      trim: true,
      default: function() {
        return this.firebaseUid ? '' : undefined;
      },
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: function() {
        return !this.firebaseUid; // Password required only if not using Firebase
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, 
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'super_admin'], 
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    authMethod: {
      type: String,
      enum: ['firebase', 'local'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt (only for local auth)
userSchema.pre('save', async function () {
  // Firebase users do NOT have passwords
  if (this.firebaseUid) return;

  // Only hash when password is created/changed
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Match user entered password to hashed password in database (only for local auth)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.firebaseUid) {
    return false; // Firebase users don't have local passwords
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;