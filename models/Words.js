const mongoose = require("mongoose");

const WordSchema = new mongoose.Schema(
  {
    en: {
      type: String,
      required: [true, "Англи утга оруулна уу"],
      trim: true,
    },
    mn: {
      type: String,
      required: [true, "Монгол утга оруулна уу"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    saved: {
      type: Boolean,
      default: false,
    },
    category: [{ type: mongoose.Schema.ObjectId, ref: "Category" }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Word", WordSchema);
