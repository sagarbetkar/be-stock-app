const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
   id: {
    type: String,
    required: true,
    unique: true
    },
    name: {
        type: String,
    }
});

module.exports = mongoose.model('Stock', StockSchema);