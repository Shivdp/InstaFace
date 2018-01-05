require ('dotenv').config();

const parser = require('body-parser')
const path = require('path'); 
const PORT = process.env.PORT; 

const express = require('express')
const app = express(); 
const routes = require('./routes'); 
const morgan = require('morgan')

app.use(parser.json()); 
app.use(parser.urlencoded({extended: true})); 
app.use(morgan('tiny')); 

app.use("/instaface", routes); 
app.use(express.static(path.resolve(__dirname, '../client/public'))); 

app.listen(PORT, () => {
    console.log("app is listening on port ", PORT); 
})
