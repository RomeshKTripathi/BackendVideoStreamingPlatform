import { Schema, mongoose } from "mongoose";

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
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export const Playlist = Model("playlist", playlistSchema);
