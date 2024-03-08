const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const app = new express();

const generalControllers = require('./controllers/generalControllers');
const tradeControllers = require('./controllers/tradeControllers');

app.use(cors())
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

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

// Routes
// GET route to retrieve portfolios 
app.get('/', generalControllers.getPortfolios)

// GET route to retrieve holdings 
app.get('/holdings', generalControllers.getHoldings);

// GET route to retrieve cumulative returns
app.get('/returns', generalControllers.getCummulativeReturns);

// POST route to add a new trade to the portfolio
app.post('/addTrade', tradeControllers.addTrade);

// POST route to update an existing trade
app.post('/updateTrade', tradeControllers.updateTrade);

// POST route to remove a trade from the portfolio
app.post('/removeTrade', tradeControllers.deleteTrade);