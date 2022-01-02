const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    productId: {
        type: String,
        required: true,
    },
    typeOfProduct: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    lendDebt: {
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
    }
})

module.exports = {
    LendDebtModel: model('LendDebt', schema)
}