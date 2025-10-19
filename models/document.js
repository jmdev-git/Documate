import mongoose, { models, Schema } from "mongoose";

const documentSchema = new Schema(
  {
    content: {
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

export const Document =
  models.Document || mongoose.model("Document", documentSchema);
