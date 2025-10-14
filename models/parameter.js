import mongoose, { models, Schema } from "mongoose";

const parameterSchema = new mongoose.Schema(
  {
    content_type: {
      type: String,
      required: true,
    },
    citation_style: {
      type: String,
      required: true,
    },
    writing_style: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Parameter =
  models.Parameter || mongoose.model("Parameter", parameterSchema);
