import mongoose from "mongoose";

const platformSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        manufacturer: {
            type: String,
            required: true,
            trim: true
        },

        release_date: {
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

const Platform = mongoose.model("Platform", platformSchema);

export default Platform;