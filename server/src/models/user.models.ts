import mongoose, { Schema, Document } from "mongoose";

interface userType extends Document {
  username: string;
  name: string;
  email: string;
  phone_no: string;
  streak: number;
  streak_data: Date | null;
  password: string;
  problems_solved: number;
  mock_interviews: number;
}

const userSchema = new Schema<userType>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone_no: {
      type: String,
      trim: true,
    },

    streak: {
      type: Number,
      default: 0,
    },

    streak_data: {
      type: Date,
      default: null,
      validate: {
        validator: function (value: Date | null) {
          if (value === null) return true;
          return value.getTime() > 0;
        },
      },
    },

    mock_interviews: {
      type: Number,
      default: 0,
    },

    problems_solved: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;