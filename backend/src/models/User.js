import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    image_url: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER"
    },

    birth_date: {
      type: Date
    },

    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);

export default User;