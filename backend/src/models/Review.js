import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 1000
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

reviewSchema.index(
    { user_id: 1, video_game_id: 1 },
    { unique: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;