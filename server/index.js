require ('dotenv').config();

const parser = require('body-parser')
const path = require('path'); 
const PORT = process.env.PORT; 

const express = require('express')
const app = express(); 
const routes = require('./routes'); 
const morgan = require('morgan')
const detect = require('./facerecofuncs/detect.js');
const enroll = require('./facerecofuncs/enroll.js');
const recon = require('./facerecofuncs/recognize.js');
const host = require('./imagehosting/hosting.js');
const PhotoController = require('./routes/Controllers/PhotoController'); 


app.use(parser.json()); 
app.use(parser.urlencoded({extended: true})); 
app.use(morgan('tiny')); 

app.use("/instaface", routes); 
app.use("/file-upload", routes); 
app.use("/imagizer.imageshack.com", (PhotoController.getPhoto)); 

app.use(express.static(path.resolve(__dirname, '../client/public'))); 
//app.get('*', (res, req) => {res.sendFile(path.resolve(__dirname, '../client/public/index.html'))}); 
app.listen(PORT, () => {
    console.log("app is listening on port ", PORT); 
})

// host.hostImage(path.resolve(__dirname, '../server/imagehosting/faceimage.jpg'), function(response) {
//     console.log(response)
// });
