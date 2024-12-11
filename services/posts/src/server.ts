import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

import express from "express";
import postRoutes from "./routes/post.routes";
import {errorHandlerMiddleware} from "shared/middleware/error.middleware";
import {responseFormatter} from "shared/middleware/responseFormatter.middleware";
import {requestLogger} from "shared/middleware/requestLogger.middleware";

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(requestLogger);

app.use(postRoutes);

app.use(errorHandlerMiddleware);
app.use(responseFormatter);

app.listen(port, () => {
    console.log(`Users service running on port ${port}`);
});
