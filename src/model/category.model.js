import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

categorySchema.virtual("products", {
  ref: "product",
  localField: "_id",
  foreignField: "categoryId",
});
categorySchema.virtual("categoryImage", {
  ref: "categoryImage",
  localField: "_id",
  foreignField: "categoryId",
});

categorySchema.set("toJSON", {
  virtuals: true,
});

const Category = mongoose.model("category", categorySchema);
export default Category;
