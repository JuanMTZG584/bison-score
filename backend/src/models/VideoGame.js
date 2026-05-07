import mongoose from "mongoose";

const videoGameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    release_date: {
      type: Date,
      required: true
    },

    developer: {
      type: String,
      required: true,
      trim: true
    },

    image_url: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/initials/svg?seed=${this.title}`;
      },
      trim: true
    },

    rating_average: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    rating_count: {
      type: Number,
      default: 0
    },

    genre_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true
    },

    platform_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Platform",
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

const VideoGame = mongoose.model("VideoGame", videoGameSchema);

export default VideoGame;