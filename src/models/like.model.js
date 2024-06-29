import { Schema, Model } from "mongoose";

const likeSchema = new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "comment",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "video",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const Like = Model("like", likeSchema);
