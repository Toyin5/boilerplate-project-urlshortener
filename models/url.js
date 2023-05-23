const mongoose = require("mongoose");

const urlDb = new mongoose.Schema(
  {
    // id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // short_url: {
    //   type: String,
    //   unique: true,
    // },
    main_url: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = urlDb;
