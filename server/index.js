import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { UserRouter } from './routes/user.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
const password = process.env.MONGO_PASSWORD

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",  
    credentials: true 
}));

app.use(cookieParser())
app.use('/auth', UserRouter)

mongoose.connect(`mongodb+srv://dpansumisra:${password}@cluster0.olcse.mongodb.net/authentication?retryWrites=true&w=majority&appName=Cluster0`)

app.listen(process.env.PORT, () => {
    console.log("Server is Running")
})
