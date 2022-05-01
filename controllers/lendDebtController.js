const { isEmpty } = require("lodash");
const { LendDebtModel } = require("../models/lendDebtModel");
const { WareHouseModel } = require("../models/warehouseModel");
const { TradingPointModel } = require("../models/tradingPointModel");
const { formatDate, getTime, toFixed, isFloat, errorHandle } = require("../utils/utiles");

async function lendDebtWareHouse(req, res) {
    try {
        let { typeOfProduct, lastDebt, description } = req.body;
        const item = await WareHouseModel.findOne({ typeOfProduct });
        if (isEmpty(item) || !lastDebt) res.status(404).send({ message: "Item not found", uz: "Ma'lumot topilmadi" });
        else {
            if (item.totalDebt === 0) res.send({ message: "have not debt", uz: "Qarz mavjud emas" });
            else {
                lastDebt = Number(lastDebt);
                let totalRemainDebt = item.totalRemainDebt - lastDebt;
                if (isFloat(totalRemainDebt)) totalRemainDebt = toFixed(totalRemainDebt);
                if (totalRemainDebt < 0) res.send({ message: "you lend more then your debt", uz: "Qarzingizdan ko'proq summa to'ladingiz bu malumot saqlanmaydi. Iltimos tekshirib qaytadan urinib ko'ring" });
                else {
                    const updateItems = await WareHouseModel.findByIdAndUpdate(item._id, {
                        totalRemainDebt,
                        lastDebt: lastDebt || item.lastDebt,
                        lastLendDebtDate: formatDate("mm/dd/yyyy")
                    });
                    const LendDebt = LendDebtModel({
                        productId: item._id,
                        typeOfProduct: item.typeOfProduct,
                        lendDebt: lastDebt,
                        description: description || "",
                        datePublished: formatDate("mm/dd/yyyy"),
                        timePublished: getTime(24),
                    })
                    await LendDebt.save();
                    res.send({ message: "data has been updated", uz: "Ma'lumot muvofiqlik yangilandi" });
                }
            }
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function lendDebtTradingPoint(req, res) {
    try {
        let { productId, lastDebt, description } = req.body;
        const item = await TradingPointModel.findById(productId);
        if (isEmpty(item) || !lastDebt) res.status(404).send({ message: "Item not found", uz: "Ma'lumot topilmadi" });
        else {
            if (item.totalDebt === 0) res.send({ message: "have not debt", uz: "Qarz mavjud emas" });
            else {
                lastDebt = Number(lastDebt);
                let totalRemainDebt = item.totalRemainDebt - lastDebt;
                if (isFloat(totalRemainDebt)) totalRemainDebt = toFixed(totalRemainDebt);
                if (totalRemainDebt < 0) res.send({ message: "you lend more then your debt", uz: "Qarzingizdan ko'proq summa to'ladingiz bu malumot saqlanmaydi. Iltimos tekshirib qaytadan urinib ko'ring" });
                else {
                    const updateItems = await TradingPointModel.findByIdAndUpdate(productId, {
                        totalRemainDebt,
                        lastDebt: lastDebt || item.lastDebt,
                        lastLendDebtDate: formatDate("mm/dd/yyyy")
                    });
                    const LendDebt = LendDebtModel({
                        productId,
                        typeOfProduct: item.typeOfProduct,
                        lendDebt: lastDebt,
                        description: description || "",
                        datePublished: formatDate("mm/dd/yyyy"),
                        timePublished: getTime(24),
                    })
                    await LendDebt.save();
                    res.send({ message: "data has been updated", uz: "Ma'lumot muvofiqlik yangilandi" });
                }
            }
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

async function getLendDebt(req, res) {
    try {
        let { productId } = req.body;
        let { skip, limit } = req.query;
        skip = Number(skip);
        limit = Number(limit);
        let result = {}
        if (skip <= limit) {
            result.items = await LendDebtModel.find({ productId }).skip(skip).limit(limit);
            result.count = await LendDebtModel.find({ productId }).count();
            res.send(result);
        } else {
            const items = await LendDebtModel.find({ productId });
            res.send(items);
        }
    } catch (e) {
        errorHandle(res, e.message);
    }
}

module.exports = {
    lendDebtWareHouse,
    lendDebtTradingPoint,
    getLendDebt
}