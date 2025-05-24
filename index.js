const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./dbconfig/dbconfig')
const cors = require('cors')
const routes = require('./routes/routes')
const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
dotenv.config()
connectDB()
app.use('/uploads', express.static('uploads'))
app.use(routes)

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))