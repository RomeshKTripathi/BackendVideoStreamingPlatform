import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const cloudinaryFileSchema = new Schema({
  asset_id: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  format: String,
  resource_type: {
    type: String,
    required: true,
  },
  version: Number,
  version_id: String,
  url: {
    type: String,
    required: true,
  },
  etag: String,
  secure_url: {
    type: String,
    required: true,
  },
  created_at: String,
  type: String,
});

const videoSchema = new Schema(
  {
    video: cloudinaryFileSchema,
    thumbnail: cloudinaryFileSchema,

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model("video", videoSchema);
