const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    branchId: {
        type: Types.ObjectId,
        required: true
    },
    productName: {
        type: String,
        required: true,
    },
    kg: {
        type: Number,
        required: true
    },
    currentlyKg: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalDebt: {
        type: Number,
        default: 0
    },
    totalRemainDebt: {
        type: Number,
        default: 0
    },
    lastLendDebtId: {
        type: Types.ObjectId,
    },
    byWhom: {
        type: String,
        required: true
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


const updateSchema = new Schema({
    productName: {
        type: String,
    },
    dataId: {
      type: Types.ObjectId
    },
    kg: {
        type: Number,
    },
    currentlyKg: {
        type: Number,
    },
    price: {
        type: Number,
    },
    totalDebt: {
        type: Number,
    },
    totalRemainDebt: {
        type: Number,
    },
    lastLendDebtId: {
        type: Types.ObjectId,
    },
    byWhom: {
        type: String,
    },

    updatedAt: {
        type: Date,
    },
    updatedById: {
        type: Types.ObjectId,
    }
})

module.exports = {
    WareHouseModel: model('WareHouse', schema),
    UpdateWareHouseModel: model('WareHouseUpdate', updateSchema),
}