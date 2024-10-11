import express from "express";
import fileRoutes from "./routes/file";
import dotenv from 'dotenv';
import cors from 'cors';

/* CONFIGURATIONS */
const app = express();
app.use(express.json());
dotenv.config();
app.use(cors())

/* ROUTES */
app.use('/files', fileRoutes)

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});