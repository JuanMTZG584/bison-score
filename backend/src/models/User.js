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
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Formato de correo no válido"]
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    image_url: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/initials/svg?seed=${this.name}`;
      }
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER"
    },

    birth_date: {
      type: Date,
      required: true
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