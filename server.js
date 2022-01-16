require('dotenv').config();

const express = require('express');
const url = require('url');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const  Schema  = mongoose.Schema;
const myURI = process.env['MONGO_URI'];

try{
mongoose.connect(myURI, { useNewUrlParser: true, useUnifiedTopology: true });
}catch(error){
  handleError(error);
}
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlSchema = new Schema({
  originalUrl:{
    type: String,
    required:true
  },
  shortUrl:{
    type: Number,
    required:true
  }
});

const Url = mongoose.model('Url', urlSchema);

const save = (originalUrl, shortUrl) => {
    Url.create({ originalUrl, shortUrl})
};

const find = (shortUrl) => Url.findOne({ shortUrl: shortUrl });

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// app.post("/api/shorturl",function(req,res){
// })

app.route("/api/shorturl").post(function(req,res){
  let stringUrl =new String(req.body.url);
 
  if(stringUrl.match(/(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.(com)?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)){
var shortUrl = Math.floor((Math.random() * 100) + 1);
  Url.create({originalUrl:req.body.url,shortUrl:shortUrl},function(err,url){
    if(err) return handleError(err);
  })
  //save(req.body.url,shortUrl)
  res.json({"original_url":req.body.url,"short_url":shortUrl }) 
  }else{
    res.json({error: 'invalid url'})
  }
  
})

app.get("/api/shorturl/:urlshort",function(req,res){
    
   //console.dir(req.params.urlshort);
   Url.find({shortUrl:req.params.urlshort},function(err,data){
      //if(err) return handleError(err);
     //res.json(data[0].originalUrl);
     res.redirect(301, data[0].originalUrl)
   });
   //console.log(url.originalUrl);
   

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


