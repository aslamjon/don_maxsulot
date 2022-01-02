const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    typeOfProduct: {
        type: String,
        required: true,
    },
    kg: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    datePublished: {
        type: String,
        required: true
    },
    timePublished: {
        type: String,
        required: true
    },
    isChanged: {
        type: Boolean,
        default: false
    },
    totalDebt: {
        type: Number,
        default: 0
    },
    totalRemainDebt: {
        type: Number,
        default: 0
    },
    lastDebt: {
        type: Number,
        default: 0
    },
    lastLendDebtDate: {
        type: String,
        default: ''
    },
    toWhom: {
        type: String,
        required: true
    }
})

module.exports = {
    TradingPointModel: model('TradingPoint', schema)
}