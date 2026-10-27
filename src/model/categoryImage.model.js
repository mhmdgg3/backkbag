import mongoose from "mongoose";

const Schema = mongoose.Schema

const categoryImageSchema = new Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    imageUrl:{
        type:String,
        required:true,
    },
    publicId:{
        type:String,
        required:true,
    },
},{timestamps:true})


const CategoryImage = mongoose.model("categoryImage" , categoryImageSchema )

export default CategoryImage