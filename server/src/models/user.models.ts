import mongoose, { Schema } from "mongoose";
import { userType } from "../types/models_type.js";

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