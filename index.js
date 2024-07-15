import './config.js'
import express from 'express'
const app = express()
import cors from 'cors'
import moment from 'moment'
import { Client } from '@gradio/client'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(bodyParser.json())

const port = process.env.PORT || 5000

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/', (req, res) => {
    res.send(`<h1>Hi Gradio API</h1>`).status(200)
    const timeStamp = moment.now()
    console.log(timeStamp)
})

app.post('/searchfood', async (req, res) => {
    try{
        const {query, location, bloodSugar} = req.body

        //Connect to Gradio API
        const gradioClient = await Client.connect('mutonyilewis/GetRecipes')

        //Make call
        const recommendation = await gradioClient.predict('/predict', [query, location, parseInt(bloodSugar)])
        const recommendations = recommendation.data
        //Response
        console.log(recommendations)
        res.json({recommendations})
    }catch(error){
        console.log('Error in Gradio call', error)
        return res.status(500).json({message: "Error in search"})
    }
})

app.get('/checkserver', async (req, res) => {
    try{
        const appss = await Client.connect("mutonyilewis/GetRecipes")
        const api_info = await appss.view_api()
        res.status(200).json(api_info)
    }catch(error){
        console.error("Error fetching space", error)
        res.status(500).json({message: 'Error in checking space', error: error.message})
    }
})

app.get('/my_love_sylvia', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

