import { Schema, Model } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    videos: {
      type: [Schema.Types.ObjectId],
      ref: "video",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const Playlist = Model("playlist", playlistSchema);
