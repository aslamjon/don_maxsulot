const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    img: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    showToAgent: {
        type: String,
        default: ''
    }
})

module.exports = {
    CardOfHomeModel: model('CardOfHome', schema)
}