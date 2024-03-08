const Trade = require("../models/Trade");
const mongoose = require('mongoose');

module.exports = {
    addTrade: async (req, res) => {
        try {
            const { date, price, type } = req.body;
            const stockId = new mongoose.Types.ObjectId();
            const trade = new Trade({ stockId, date, price, type });
            await trade.save();
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    updateTrade:  async (req, res) => {
        try {
            const { tradeId, date, price, type } = req.body;
            await Trade.findByIdAndUpdate(tradeId, { date, price, type });
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    deleteTrade: async (req, res) => {
        try {
            const { tradeId } = req.body;
            await Trade.findByIdAndDelete(tradeId);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}