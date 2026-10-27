import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductVariantSchema = new Schema(
  {
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    minQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discoundPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    color: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    productMain: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);





export const ProductVariant = mongoose.model("productVariant" , ProductVariantSchema);
