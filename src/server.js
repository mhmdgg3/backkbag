import "./config/env.js";
import app from "./app.js";
import db from "./config/mongoDb.js";

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`app listen to port ${PORT}`);
});
