const {isNumber, isEmpty, isBoolean} = require("lodash");
const {Types} = require('mongoose');

const {WareHouseModel, UpdateWareHouseModel} = require("../models/warehouseModel");
const {isFloat, toFixed, getDataFromModelByQuery, getOneFromModelByQuery, getTimes, deleteFormat, updateFormat} = require('../utils/utiles');
const logger = require("../utils/logger");
const {errors} = require("../utils/constants");

const fileName = require('path').basename(__filename);

const errorHandling = (e, functionName, res) => {
    logger.error(`${e.message} -> ${fileName} -> ${functionName}`);
    errors.SERVER_ERROR(res);
}

const getWareHousesByQuery = ({ query = {} } = {}) => getDataFromModelByQuery({ Model: WareHouseModel, query });
const getWareHouseByQuery = ({ query = {} } = {}) => getOneFromModelByQuery({ Model: WareHouseModel, query });

// REQUEST AND RESPONSE
const createWareHouse = async (req, res) => {
    try {
        let {branchId, productName, kg, price, isDebt, byWhom} = req.body;
        if (!branchId && !productName && !kg && !price && !byWhom && isNumber(kg) && isNumber(price)) res.status(400).send({message: "branchId, productName, kg, price, byWhom fields are required"});

        else {
            let totalDebt = 0;
            kg = toFixed(kg);
            if (isDebt) {
                let total = kg * price;
                if (isFloat(total)) totalDebt = toFixed(total);
                else totalDebt = total;
            }

            const wareHouse = new WareHouseModel({
                branchId,
                productName,
                kg,
                currentlyKg: kg,
                price,
                createdById: Types.ObjectId(req.user.userId),
                totalDebt,
                totalRemainDebt: totalDebt,
                byWhom
            });
            await wareHouse.save();
            const wareHouses = await getWareHousesByQuery();
            res.send({message: "data has been saved in WareHouse", data: {wareHouses}});
        }
    } catch (e) {
        errorHandling(e, createWareHouse.name, res);
    }
}

const getAllWareHouses = async (req, res) => {
    try {
        let {skip, limit} = req.query;
        let result = {};

        if (skip && limit) {
            skip = Number(skip);
            limit = Number(limit);
        }

        if (skip <= limit) {
            result.items = await getWareHousesByQuery().skip(skip).limit(limit);
            result.count = await getWareHousesByQuery().count();
            res.send({data: result.items, count: result.count});
        } else {
            const items = await getWareHousesByQuery();
            res.send({data: items});
        }
    } catch (e) {
        errorHandling(e, getAllWareHouses.name, res);
    }
}

const getAllWareHousesByIds = async (req, res) => {
    try {
        let {skip, limit} = req.query;
        const {branchId, id} = req.body;

        let query = {branchId, _id: id};
        let result = {};

        if (!branchId) delete query.branchId;
        if (!id) delete query._id;


        if (skip && limit) {
            skip = Number(skip);
            limit = Number(limit);
        }

        if (skip <= limit) {
            result.items = await getWareHousesByQuery({query}).skip(skip).limit(limit);
            result.count = await getWareHousesByQuery({query}).count();
            res.send({data: result.items, count: result.count});
        } else {
            const items = await getWareHousesByQuery({query});
            res.send({data: items});
        }
    } catch (e) {
        errorHandling(e, getAllWareHousesByIds.name, res);
    }
}

const updateWareHouse = async (req, res) => {
    try {
        const {id, branchId} = req.query;
        let {productName, kg, price, byWhom, isDebt} = req.body;

        if (!id || !branchId) return res.status(400).send({message: "branchId and id are required"});

        let query = {branchId, _id: id};

        let wareHouse = await getWareHouseByQuery({query});

        if (isEmpty(productName) && isNumber(kg) && isNumber(price) && isEmpty(byWhom) && isBoolean(isDebt))
            return res.status(400).send({message: "data should not be empty"});

        if (isEmpty(wareHouse)) return res.status(404).send({ message: "data not found" });

        let totalDebt = 0;
        if (isDebt) {
            let kg = toFixed(kg || wareHouse.kg);
            let total = kg * (price || wareHouse.price);
            if (isFloat(total)) totalDebt = toFixed(total);
            else totalDebt = total;
        }

        const updateWareHouse = new UpdateWareHouseModel({
            updatedAt: getTimes(),
            updatedById: Types.ObjectId(req.user.userId),
            dataId: wareHouse._id
        });

        // AGAR KG O'ZGARGANDA KG QANCHA O'ZGARGAN BO'LSA CURRENTLYKG NI HAM SHUNCHAGA O'ZGARTIRAMIZ
        if (isNumber(kg) && (kg !== wareHouse.kg)) {
            if (kg > wareHouse.kg) {
                updateWareHouse.currentlyKg = wareHouse.currentlyKg;
                wareHouse.currentlyKg = toFixed(wareHouse.currentlyKg + (kg - wareHouse.kg));
            } else if (kg < wareHouse.kg) {
                if ((wareHouse.currentlyKg - (wareHouse.kg - kg)) > 0) {
                    updateWareHouse.currentlyKg = wareHouse.currentlyKg;
                    wareHouse.currentlyKg = toFixed(wareHouse.currentlyKg - (wareHouse.kg - kg));
                } else {
                    updateWareHouse.currentlyKg = wareHouse.currentlyKg;
                    wareHouse.currentlyKg = 0;
                }
            }
            updateWareHouse.kg = wareHouse.kg;
            wareHouse.kg = toFixed(kg);
        }

        if (!isEmpty(productName) && wareHouse.productName !== productName) updateWareHouse.productName = wareHouse.productName;
        if (isNumber(price) && wareHouse.price !== price) updateWareHouse.price = wareHouse.price;
        if (!isEmpty(byWhom) && wareHouse.byWhom !== byWhom) updateWareHouse.byWhom = wareHouse.byWhom;
        if (isBoolean(isDebt) && wareHouse.isDebt !== isDebt) updateWareHouse.isDebt = wareHouse.isDebt;

        wareHouse.productName = productName || wareHouse.productName;
        wareHouse.price = price || wareHouse.price;
        wareHouse.byWhom = byWhom || wareHouse.byWhom;
        wareHouse.isDebt = isDebt || wareHouse.isDebt;

        wareHouse = updateFormat({ item: wareHouse, id: req.user.userId });
        await wareHouse.save();
        if (Object.keys(updateWareHouse._doc).length > 4) updateWareHouse.save();
        let response = {...wareHouse._doc};
        delete response.updated;
        delete response.updatedById;
        res.send(response);
    } catch (e) {
        errorHandling(e, updateWareHouse.name, res);
    }
}

const deleteWareHouse = async (req, res) => {
    try {
        const { id } = req.params;
        let query = {_id: id};

        const wareHouse = await getWareHouseByQuery({query});
        if (!wareHouse) res.status(404).send({ message: "warehouse is not found" });
        else {
            await deleteFormat({ item: wareHouse, id: req.user.userId }).save();
            const wareHouses = await getWareHousesByQuery();
            res.send({message: "branch has been deleted", data: {wareHouses}});
        }
    } catch (e) {
        errorHandling(e, deleteWareHouse.name, res);
    }
}

module.exports = {
    createWareHouse,
    getAllWareHouses,
    getAllWareHousesByIds,
    updateWareHouse,
    deleteWareHouse
}