const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const app = new express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODBURI, {}).then(
  () => { 
      console.log('MongoDB Connected');
      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })
   },
  err => { 
      console.log('MongoDB Disconnected' ,err);
   }
);


