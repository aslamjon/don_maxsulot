const { isNumber, isEmpty } = require("lodash");
const { WareHouseModel } = require("../models/warehouseModel");
const { errorHandle, formatDate, getTime, isFloat, toFixed } = require('./../utiles');

async function createWareHouse(req, res) {
    try {
        let { typeOfProduct, kg, price, isDebt, byWhom } = req.body;
        if (!typeOfProduct && !kg && !price && !byWhom && isNumber(kg) && isNumber(price)) res.status(400).send({ message: "Bad request" });
        else {
            let wareHouse = await WareHouseModel.findOne({ typeOfProduct, byWhom, price });
            let totalDebt = 0;
            kg = toFixed(kg);
            if (isDebt) {
                let total = kg * price;
                if (isFloat(total)) totalDebt = toFixed(total);
                else totalDebt = total;
            }
            if (!isEmpty(wareHouse)) {
                wareHouse.kg += kg;
                wareHouse.currentlyKg += kg;
                wareHouse.datePublished = formatDate("mm/dd/yyyy");
                wareHouse.timePublished = getTime(24);
                if (wareHouse.totalRemainDebt > 0) {
                    if (isDebt) {
                        wareHouse.totalDebt += totalDebt;
                        wareHouse.totalRemainDebt += totalDebt;
                    }
                } else {
                    if (isDebt) {
                        wareHouse.totalDebt += totalDebt;
                        wareHouse.totalRemainDebt += totalDebt;
                    }
                }
            }
            else {
                wareHouse = WareHouseModel({
                    typeOfProduct,
                    kg,
                    currentlyKg: kg,
                    price,
                    datePublished: formatDate("mm/dd/yyyy"),
                    timePublished: getTime(24),
                    totalDebt,
                    totalRemainDebt: totalDebt,
                    byWhom
                });
            }
            await wareHouse.save();
            res.send({ message: "item has been saved in WareHouse", uz: "Ma'lumot muvofiqlik saqlandi" });
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function getWareHouses(req, res) {
    try {
        let { skip, limit } = req.query;
        skip = Number(skip);
        limit = Number(limit);
        let result = {}
        if (skip <= limit) {
            result.items = await WareHouseModel.find().skip(skip).limit(limit);
            result.count = await WareHouseModel.find().count();
            res.send(result);
        } else {
            const items = await WareHouseModel.find();
            res.send(items);
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function getWareHouse(req, res) {
    try {
        const { id } = req.params;
        const items = await WareHouseModel.findById(id);
        if (!items) res.status(404).send({ message: "data not found", uz: "Ma'lumot topilmadi" });
        else res.send(items);
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function updateWareHouse(req, res) {
    try {
        const { id } = req.params;
        let { typeOfProduct, kg, price, currentlyKg } = req.body;
        const item = await WareHouseModel.findById(id);
        if (isEmpty(item)) res.statsu(404).send({ message: "Item not found", uz: "Ma'lumot topilmadi" });
        else {
            if (item.lastDebt == 0) kg = toFixed(kg) || item.kg;
            const updateItems = await WareHouseModel.findByIdAndUpdate(id, {
                typeOfProduct: typeOfProduct || item.typeOfProduct,
                kg,
                price: price || item.price,
                currentlyKg: toFixed(currentlyKg) || item.currentlyKg,
                isChanged: true,
            });
            res.send({ message: "data has been updated", uz: "Ma'lumot muvofiqlik yangilandi" });
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function deleteWareHouse(req, res) {
    try {
        const { id } = req.params;
        let item = await WareHouseModel.findByIdAndDelete(id);
        if (!item) res.status(404).send({ message: "a data not found", uz: "Ma'lumot topilmadi" });
        else res.send({ message: "a data has been deleted", uz: "Ma'lumot o'chirildi" });
    } catch (e) {
        errorHandle(res, e.message);
    }
}

module.exports = {
    createWareHouse,
    getWareHouses,
    getWareHouse,
    updateWareHouse,
    deleteWareHouse
}