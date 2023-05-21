import mongoose from "mongoose";

const Url = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    short_url: {
      type: String,
      unique: true,
    },
    main_url: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Url", Url);
