import cookieParser from "cookie-parser"
import express, { urlencoded } from "express"
import cors from "cors"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "20kb"}))
app.use(urlencoded({limit: "20kb", extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

export default app