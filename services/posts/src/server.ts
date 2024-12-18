import dotenv from "dotenv";
import path from "node:path";
import express from "express";
import postRoutes from "./routes/post.routes";
import { errorHandlerMiddleware, requestLogger, responseFormatter } from "@sweetch/shared";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(requestLogger);

app.use(postRoutes);

app.use(errorHandlerMiddleware);
app.use(responseFormatter);

app.listen(port, () => {
    console.log(`Posts service running on port ${port}`);
});
