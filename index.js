const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const  shortid  = require('shortid');

const app = express();

require('dotenv').config();





app.use(express.urlencoded({extended:true}))
app.use(express.json());

let shortId = shortid.generate();

const userSchema = new mongoose.Schema({
    shortURL:{
        type: String,
        required :true,
        unique:true,
    },
    redirectionURL:{
    type:String,
    required:true,
}
});
const URL = mongoose.model('URL',userSchema);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log("Error connecting to database",err)
})


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})

app.post('/url',async(req,res)=>{
    const longURL = req.body.url;
    await URL.create({
        shortURL : shortId,
        redirectionURL: longURL
    })
    res.send(`<p>Your Short URL is <a href="${shortId}">http://localhost:1000/${shortId}<p>`);
})


app.get('/:shortURL',async(req,res)=>{
    const shortURL = req.params.shortURL;
    const url = await URL.findOne({shortURL :shortURL});
    res.redirect(url?.redirectionURL)
})

app.listen(1000,()=>{
    console.log("server started at 1000")
})
