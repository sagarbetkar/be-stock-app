const Stock = require('../models/Stock');

module.exports = {
    getPortfolios: async (req, res) => {
        try {
            const portfolios = await Stock.aggregate([
                {
                    $lookup: {
                        from: "trades",
                        localField: "id",
                        foreignField: "stockId",
                        as: "result"
                    }
                },
                { $unwind: "$result" },
                { $sort: { "result.date": 1} },
                {
                    $group: {
                        _id: "$name",
                        trades: {
                            $push: {
                                id: "$result._id",
                                type: "$result.type",
                                date: "$result.date",
                                price: "$result.price"
                            }
                        }
                    }
                }
            ]).exec();
            return portfolios ? res.json({
                success: true,
                data: portfolios,
                message: 'Portfolios retrieved successfully'
            }) : res.status(404).json({ message: 'Not Found' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getHoldings:async (req, res) => {
        try {
            const holdings = await Stock.aggregate([
                    {
                        $lookup: {
                            from: 'trades',
                            localField: 'id',
                        foreignField: "stockId",
                            as: 'stock'
                        }
                    },
                    {
                        $unwind: '$stock'
                    },
                    {
                        $project: {
                        _id: 1,
                        name: 1,
                        stock: 1,
                        buyQuantity: {$cond: [{$eq: ["$stock.type", "buy"]}, 1,0 ]},
                        totalPrice: {$sum: {$cond: [{$eq: ["$stock.type", "buy"]}, "$stock.price",0 ]}},
                        sellQuantity: {$cond: [{$eq: ["$stock.type", "sell"]}, 1,0 ]}           
                        }
                    },
                    {
                        $group: {
                            //_id: { name: "$name", type: "$stock.type"},
                            _id:"$name",
                            buyQuantity: {$sum: "$buyQuantity"},
                            sellQuantity: {$sum: "$sellQuantity"},
                            amount: {$sum: "$totalPrice"},
                            avgPrice: {$avg: "$totalPrice"},
                            trades: {
                                $push: {
                                    id: "$stock._id",
                                    type: "$stock.type",
                                    date: "$stock.date",
                                    price: "$stock.price"
                                }
                            }
                        }
                    },
                    {$project: {
                        _id: 1,
                        quantity: "$buyQuantity",
                        avgPrice: 1,
                        totalAmount: "$amount"
                    }}
                ]).exec()
            res.json({ success: true, data: holdings });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    getCummulativeReturns: async (req, res) => {
        try {
            const creturns = await Stock.aggregate([
                    {
                        $lookup: {
                            from: 'trades',
                            localField: 'id',
                        foreignField: "stockId",
                            as: 'stock'
                        }
                    },
                    {
                        $unwind: '$stock'
                    },
                    {
                        $project: {
                        _id: 1,
                        name: 1,
                        returns: {$sum: {$cond: [{$eq: ["$stock.type", "buy"]}, {$subtract:[100, "$stock.price"]},0 ]}},      
                        }
                    },
                    {
                        $group: {
                            _id:"$name",
                            returns: {$sum: "$returns"},
                        }
                    },
                    {$project: {
                        _id: 1,
                        returns: 1,
                    }}
                ]);
            res.json({ success: true, data: { creturns } });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}