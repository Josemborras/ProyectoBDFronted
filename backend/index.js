import express from "express";
import { pool } from "./db.js"
import cors from "cors"

const app = express()

app.use(cors())