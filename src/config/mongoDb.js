import mongoose from "mongoose";

const db = await mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB conected");
  })
  .catch((err) => {
    throw Error("DB error", err.message);
  });

export default db;
