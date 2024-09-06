const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const  shortid  = require('shortid');
const app = express();

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

mongoose.connect('mongodb://127.0.0.1:27017/url-shortner')
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
    res.send(`<p>Your Short URL is <a href="http://localhost:1000/${shortId}">http://localhost:1000/${shortId}<p>`);
})


app.get('/:shortURL',async(req,res)=>{
    const shortURL = req.params.shortURL;
    const url = await URL.findOne({shortURL :shortURL});
    res.redirect(url?.redirectionURL)
})

app.listen(1000,()=>{
    console.log("server started at 1000")
})
