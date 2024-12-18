import dotenv from "dotenv";
import path from "node:path";
import express from "express";
import userRoutes from "./routes/user.routes";
import { errorHandlerMiddleware, requestLogger, responseFormatter } from "@sweetch/shared";
import logger from "@sweetch/shared/dist/utils/logger";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(requestLogger);

app.use(userRoutes);

app.use(errorHandlerMiddleware);
app.use(responseFormatter);

app.listen(port, () => {
    console.log(`Users service running on port ${port}`);
});
