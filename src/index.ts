import express from "express";
import folderRoutes from "./routes/folder";
import fileRoutes from "./routes/file";
import eplusRoutes from "./routes/eplus";
import dotenv from 'dotenv';
import cors from 'cors';

/* CONFIGURATIONS */
const app = express();
app.use(express.json());
dotenv.config();
app.use(cors())

/* ROUTES */
app.use('/folders', folderRoutes);
app.use('/folders', fileRoutes);
app.use('/eplus', eplusRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});