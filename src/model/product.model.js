import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"category",
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

ProductSchema.virtual("productVariants", {
  ref: "productVariant",
  localField: "_id",
  foreignField: "productId",
});

ProductSchema.virtual("images", {
  ref: "productImage",
  localField: "_id",
  foreignField: "productId",
});
ProductSchema.set("toJSON", {
  virtuals: true,
});

export const Product = mongoose.model("product", ProductSchema);
