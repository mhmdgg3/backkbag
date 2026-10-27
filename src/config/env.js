import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const evnPath = path.resolve(__dirname, "../../.env");

dotenv.config({
  path: evnPath,
});
