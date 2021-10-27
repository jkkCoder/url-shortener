const express = require("express")
const path = require("path")
const ShortUrl = require("./models/shortUrl")
const mongoose = require("mongoose")
const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/urlShortener")

const port = process.env.PORT || 3000

app.set("view engine","hbs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/",async (req,res)=>{
    const shortUrls = await ShortUrl.find({})
    res.render("index",{shortUrls})
})

app.post("/shortUrls",async (req,res)=>{
    await ShortUrl.create({full:req.body.fullUrl}) 
    res.redirect("/")
})

app.get("/:shortUrl",async(req,res)=>{
    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrl})
    if(shortUrl==null)  return res.sendStatus(404)

    shortUrl.clicks++;
    await shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(port,()=>{
    console.log("server up and running at port ",port)
})