import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productImageSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productVariant",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    isCover: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const ProductImage = mongoose.model("productImage", productImageSchema);
