const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdById: {
        type: Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
    },
    updatedById: {
        type: Types.ObjectId,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
    },
    deletedById: {
        type: Types.ObjectId,
    }
})

module.exports = {
    BranchModel: model('Branch', schema)
}