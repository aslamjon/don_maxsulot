const { isNumber, isEmpty } = require("lodash");
const { BazaarModel } = require("../models/bazaarModel");
const { WareHouseModel } = require("../models/warehouseModel");
const { errorHandle, formatDate, getTime, isFloat, toFixed } = require('../utils/utiles');

async function createBazaar(req, res) {
    try {
        let { typeOfProduct, kg, sellingPrice, isDebt, toWhom } = req.body;
        if (!typeOfProduct && !kg && !sellingPrice && toWhom && isNumber(kg) && isNumber(sellingPrice)) res.status(400).send({ message: "Bad request" });
        else {
            const product = await WareHouseModel.findOne({ typeOfProduct });
            let bazzar = await BazaarModel.findOne({ typeOfProduct, toWhom, sellingPrice });
            if (product) {
                let totalDebt = 0;
                kg = toFixed(kg);
                if (isDebt) {
                    let total = kg * sellingPrice;
                    if (isFloat(total)) totalDebt = toFixed(total);
                    else totalDebt = total;
                }
                const isRight = product.currentlyKg - kg;
                if (isRight < 0) {
                    res.send({ message: "You have entered more than the kg available in the warehouse", uz: `Omborda buncha mahsulot mavjud emas` });
                }
                else {
                    // if there was product
                    if (bazzar) {
                        bazzar.kg += kg;
                        bazzar.datePublished = formatDate("mm/dd/yyyy");
                        bazzar.timePublished = getTime(24);
                        // if there was debt
                        if (bazzar.totalRemainDebt > 0) {
                            // if agan get product by debt
                            if (isDebt) {
                                bazzar.totalDebt += totalDebt;
                                bazzar.totalLeadDebt += totalDebt;
                            }
                        } else {
                            if (isDebt) {
                                bazzar.totalDebt += totalDebt;
                                bazzar.totalLeadDebt += totalDebt;
                            }
                        }
                    } else {
                        bazzar = BazaarModel({
                            typeOfProduct,
                            kg,
                            sellingPrice,
                            price: product.price,
                            datePublished: formatDate("mm/dd/yyyy"),
                            timePublished: getTime(24),
                            totalDebt,
                            totalRemainDebt: totalDebt,
                            toWhom
                        });
                    }
                    product.currentlyKg = isRight;
                    await product.save();
                    await bazzar.save();
                    res.send({ message: "item has been saved in Bazaar", uz: "Ma'lumot muvofiqlik saqlandi" });
                }
            } else res.status(404).send({ message: "Product not found", uz: "Mahsulot topilmadi" });
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function getBazaars(req, res) {
    try {
        let { skip, limit } = req.query;
        skip = Number(skip);
        limit = Number(limit);
        let result = {}
        if (skip <= limit) {
            result.items = await BazaarModel.find().skip(skip).limit(limit);
            result.count = await BazaarModel.find().count();
            res.send(result);
        } else {
            const items = await BazaarModel.find();
            res.send(items);
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function getBazaar(req, res) {
    try {
        const { id } = req.params;
        const items = await BazaarModel.findById(id);
        if (!items) res.status(404).send({ message: "data not found", uz: "Ma'lumot topilmadi" });
        else res.send(items);
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function updateBazaar(req, res) {
    try {
        const { id } = req.params;
        let { typeOfProduct, kg, sellingPrice, byWhom, isDebt } = req.body;
        const item = await BazaarModel.findById(id);
        if (isEmpty(item)) res.statsu(404).send({ message: "Item not found", uz: "Ma'lumot topilmadi" });
        else {
            const product = await WareHouseModel.findOne({ typeOfProduct: item.typeOfProduct });
            kg = toFixed(kg) || item.kg;
            if (kg > item.kg) {
                product.currentlyKg -= (kg - item.kg);
                if (isDebt && (item.totalRemainDebt > 0)) {
                    item.totalRemainDebt -= (kg - item.kg) * sellingPrice;
                    item.totalDebt -= (kg - item.kg) * sellingPrice;
                }
            }
            else if (kg < item.kg) {
                product.currentlyKg += (item.kg - kg);
                if (isDebt && (item.totalRemainDebt > 0)) {
                    item.totalRemainDebt += (item.kg - kg) * sellingPrice;
                    item.totalDebt += (item.kg - kg) * sellingPrice;
                }
            }
            const updateItems = await BazaarModel.findByIdAndUpdate(id, {
                typeOfProduct: typeOfProduct || item.typeOfProduct,
                kg,
                sellingPrice: sellingPrice || item.sellingPrice,
                isChanged: true,
                byWhom: byWhom || item.byWhom,
                modifiedDate: formatDate("mm/dd/yyyy"),
                modifiedTime: getTime(24)
            });
            await product.save();
            await item.save();
            res.send({ message: "data has been updated", uz: "Ma'lumot muvofiqlik yangilandi" });
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function deleteBazaar(req, res) {
    try {
        const { id } = req.params;
        let item = await BazaarModel.findByIdAndDelete(id);
        if (!item) res.status(404).send({ message: "a data not found", uz: "Ma'lumot topilmadi" });
        else res.send({ message: "a data has been deleted", uz: "Ma'lumot o'chirildi" });
    } catch (e) {
        errorHandle(res, e.message);
    }
}

module.exports = {
    createBazaar,
    getBazaars,
    getBazaar,
    updateBazaar,
    deleteBazaar
}