import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
    {
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        video_game_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VideoGame",
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

ratingSchema.index(
    { user_id: 1, video_game_id: 1 },
    { unique: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;