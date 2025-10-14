import mongoose, { models, Schema } from "mongoose";

const responseSchema = new Schema(
  {
    user_text: {
      type: String,
      required: true,
    },
    ai_response: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Response =
  models.Response || mongoose.model("Response", responseSchema);
